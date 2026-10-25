import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadNotes, saveNote, STORAGE_KEY } from '../notes.js';

function memoryStorage() {
  const data = new Map();
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
}

test('creates a note and restores it after reloading storage', () => {
  const storage = memoryStorage();
  assert.deepEqual(loadNotes(storage), []);
  const notes = saveNote(storage, [], { title: ' Idea ', content: ' Mi primera nota ' });
  assert.equal(notes[0].title, 'Idea');
  assert.equal(notes[0].content, 'Mi primera nota');
  assert.ok(notes[0].id);
  assert.deepEqual(loadNotes(storage), notes);
});

test('edits only the selected note and persists the update', () => {
  const storage = memoryStorage();
  let notes = saveNote(storage, [], { title: 'Uno', content: 'Original' });
  notes = saveNote(storage, notes, { title: 'Dos', content: 'Otra' });
  const updated = saveNote(storage, notes, { id: notes[1].id, title: 'Editada', content: 'Nuevo texto' });
  assert.equal(updated.length, 2);
  assert.deepEqual(updated[0], notes[0]);
  assert.equal(updated[1].content, 'Nuevo texto');
  assert.deepEqual(loadNotes(storage), updated);
});

test('rejects blank or oversized notes without writing', () => {
  const storage = memoryStorage();
  for (const note of [{ title: ' ', content: 'Texto' }, { title: 'Título', content: '\n ' }, { title: 'x'.repeat(121), content: 'Texto' }]) {
    assert.throws(() => saveNote(storage, [], note));
    assert.equal(storage.getItem(STORAGE_KEY), null);
  }
});

test('failed persistence does not mutate existing notes', () => {
  const storage = memoryStorage();
  const notes = saveNote(storage, [], { title: 'Original', content: 'Conservar' });
  const original = structuredClone(notes);
  const raw = storage.getItem(STORAGE_KEY);
  storage.setItem = () => { throw new Error('QuotaExceededError'); };
  assert.throws(() => saveNote(storage, notes, { id: notes[0].id, title: 'Cambio', content: 'Nuevo' }));
  assert.deepEqual(notes, original);
  assert.equal(storage.getItem(STORAGE_KEY), raw);
});

test('detects corrupt data without overwriting it', () => {
  const storage = memoryStorage();
  for (const raw of ['{', '{}', '[null]', '[{"id":"a","title":"x","content":"y","updatedAt":"invalid"}]']) {
    storage.setItem(STORAGE_KEY, raw);
    assert.throws(() => loadNotes(storage));
    assert.equal(storage.getItem(STORAGE_KEY), raw);
  }
});

test('preserves literal HTML text in storage', () => {
  const storage = memoryStorage();
  const text = '<img src=x onerror=alert(1)>';
  saveNote(storage, [], { title: text, content: text });
  assert.equal(loadNotes(storage)[0].content, text);
});
