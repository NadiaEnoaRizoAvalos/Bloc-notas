export const STORAGE_KEY = 'bloc-notas.v1';

export function loadNotes(storage) {
  const raw = storage.getItem(STORAGE_KEY);
  if (raw === null) return [];
  const notes = JSON.parse(raw);
  if (!Array.isArray(notes) || !notes.every(note =>
    note && typeof note.id === 'string' && typeof note.title === 'string' &&
    typeof note.content === 'string' && typeof note.updatedAt === 'string' &&
    Number.isFinite(Date.parse(note.updatedAt))) ||
    new Set(notes.map(note => note.id)).size !== notes.length) {
    throw new Error('Invalid stored notes');
  }
  return notes;
}

export function saveNote(storage, notes, { id, title, content }) {
  title = title.trim();
  content = content.trim();
  if (!title || !content || title.length > 120 || content.length > 20000) {
    throw new Error('Invalid note');
  }
  if (JSON.stringify(loadNotes(storage)) !== JSON.stringify(notes)) {
    const error = new Error('Stored notes changed');
    error.code = 'STORAGE_CONFLICT';
    throw error;
  }
  const note = { id: id ?? globalThis.crypto.randomUUID(), title, content, updatedAt: new Date().toISOString() };
  const next = id ? notes.map(existing => existing.id === id ? note : existing) : [note, ...notes];
  if (id && !notes.some(existing => existing.id === id)) throw new Error('Note not found');
  // Only expose the new state after persistence succeeds.
  storage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
