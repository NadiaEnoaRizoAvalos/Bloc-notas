import { loadNotes, saveNote } from './notes.js';

const form = document.querySelector('#note-form');
const title = document.querySelector('#title');
const content = document.querySelector('#content');
const status = document.querySelector('#status');
const cancel = document.querySelector('#cancel');
let notes = [];
let editingId;
let storage;

function announce(message, error = false) {
  status.textContent = message;
  status.classList.toggle('error', error);
}

function resetEditor() {
  editingId = undefined;
  form.reset();
  document.querySelector('#editor-title').textContent = 'Nueva nota';
  document.querySelector('#save').textContent = 'Guardar nota ＋';
  cancel.hidden = true;
}

function render() {
  const list = document.querySelector('#notes');
  list.replaceChildren();
  document.querySelector('#count').textContent = notes.length;
  document.querySelector('#empty').hidden = notes.length > 0;
  for (const note of notes) {
    const article = document.createElement('article');
    article.className = 'note';
    const heading = document.createElement('h3');
    heading.textContent = note.title;
    const body = document.createElement('p');
    body.textContent = note.content;
    const bottom = document.createElement('div');
    bottom.className = 'note-bottom';
    const date = document.createElement('time');
    date.dateTime = note.updatedAt;
    date.textContent = new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(note.updatedAt));
    const edit = document.createElement('button');
    edit.type = 'button';
    edit.textContent = 'Editar';
    edit.setAttribute('aria-label', `Editar nota: ${note.title}`);
    edit.addEventListener('click', () => {
      editingId = note.id;
      title.value = note.title;
      content.value = note.content;
      document.querySelector('#editor-title').textContent = 'Editar nota';
      document.querySelector('#save').textContent = 'Guardar cambios';
      cancel.hidden = false;
      announce('Estás editando una nota.');
      title.focus();
    });
    bottom.append(date, edit);
    article.append(heading, body, bottom);
    list.append(article);
  }
}

try {
  storage = window.localStorage;
  notes = loadNotes(storage);
} catch {
  announce('No pudimos leer las notas. Para proteger tus datos, el guardado está deshabilitado. Revisá el almacenamiento del navegador y recargá la página.', true);
  document.querySelector('#save').disabled = true;
}
render();

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!title.value.trim() || !content.value.trim()) {
    announce('Completá el título y la nota con algo más que espacios.', true);
    (!title.value.trim() ? title : content).focus();
    return;
  }
  try {
    notes = saveNote(storage, notes, { id: editingId, title: title.value, content: content.value });
  } catch {
    announce('No se pudo guardar la nota. Tu texto sigue acá: revisá el espacio y los permisos del navegador e intentá de nuevo.', true);
    return;
  }
  resetEditor();
  render();
  announce('Nota guardada en este navegador.');
  title.focus();
});
cancel.addEventListener('click', () => {
  resetEditor();
  announce('Edición cancelada.');
  title.focus();
});
