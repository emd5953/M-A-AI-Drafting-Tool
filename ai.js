const documentList = document.getElementById('documentList');
const filePicker = document.getElementById('filePicker');
const askButton = document.getElementById('askButton');
const questionInput = document.getElementById('questionInput');
const conversation = document.getElementById('conversation');
const welcomeState = document.getElementById('welcomeState');
const selectedDocuments = new Set();
let documents = [];
let toastTimeout;

function toast(message) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.classList.add('visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => el.classList.remove('visible'), 2500);
}

async function api(path, options = {}) {
  const response = await fetch(path, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = Array.isArray(data.detail) ? data.detail.map(item => item.msg).join(', ') : data.detail;
    throw new Error(detail || `Request failed (${response.status})`);
  }
  return data;
}

function updateComposer() {
  const count = selectedDocuments.size;
  document.getElementById('selectedCount').textContent = `${count} document${count === 1 ? '' : 's'} selected`;
  document.getElementById('documentCount').textContent = `${documents.length} file${documents.length === 1 ? '' : 's'} indexed`;
  document.getElementById('selectAllBtn').textContent = count === documents.length && count > 0 ? 'Deselect all' : 'Select all';
  askButton.disabled = count === 0 || !questionInput.value.trim() || askButton.dataset.busy === 'true';
}

function renderDocuments() {
  documentList.replaceChildren();
  if (!documents.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-docs';
    empty.textContent = 'Upload a diligence file to get started.';
    documentList.append(empty);
    updateComposer();
    return;
  }
  documents.forEach(doc => {
    const row = document.createElement('div');
    row.className = 'doc-row';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = selectedDocuments.has(doc.id);
    checkbox.setAttribute('aria-label', `Include ${doc.filename} in AI search`);
    checkbox.addEventListener('change', () => {
      checkbox.checked ? selectedDocuments.add(doc.id) : selectedDocuments.delete(doc.id);
      updateComposer();
    });
    const info = document.createElement('div');
    info.className = 'doc-info';
    const name = document.createElement('strong');
    name.textContent = doc.filename;
    name.title = doc.filename;
    const details = document.createElement('small');
    details.textContent = `${formatBytes(doc.size_bytes)} · ${Number(doc.extracted_chars).toLocaleString()} characters`;
    info.append(name, details);
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'doc-delete';
    remove.textContent = '×';
    remove.setAttribute('aria-label', `Remove ${doc.filename}`);
    remove.addEventListener('click', () => removeDocument(doc));
    row.append(checkbox, info, remove);
    documentList.append(row);
  });
  updateComposer();
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function refreshDocuments() {
  const data = await api('/api/documents');
  documents = data.documents;
  for (const id of [...selectedDocuments]) {
    if (!documents.some(doc => doc.id === id)) selectedDocuments.delete(id);
  }
  documents.forEach(doc => selectedDocuments.add(doc.id));
  renderDocuments();
}

async function refreshHealth() {
  const status = document.getElementById('modelStatus');
  try {
    const data = await api('/api/health');
    const ready = data.ollama && data.chat_model_ready && data.embedding_model_ready;
    status.classList.toggle('ready', ready);
    status.classList.toggle('error', !ready);
    const label = status.querySelector('span:last-child');
    label.textContent = ready
      ? `Local AI ready · ${data.chat_model}`
      : data.ollama
        ? `Run ollama pull ${!data.chat_model_ready ? data.chat_model : data.embedding_model}`
        : 'Ollama is offline · run ollama serve';
  } catch {
    status.classList.add('error');
    status.querySelector('span:last-child').textContent = 'Local AI service unavailable';
  }
}

async function uploadFiles(files) {
  const accepted = [...files].filter(file => /\.(pdf|docx|txt|md)$/i.test(file.name));
  if (!accepted.length) return toast('Choose a PDF, DOCX, TXT, or Markdown file.');
  const progress = document.getElementById('uploadProgress');
  progress.hidden = false;
  const note = progress.querySelector('small');
  let added = 0;
  try {
    for (const file of accepted) {
      note.textContent = `Reading and indexing ${file.name} locally…`;
      const body = new FormData();
      body.append('file', file);
      const result = await api('/api/documents', { method: 'POST', body });
      if (!result.duplicate) added++;
    }
    await refreshDocuments();
    toast(added ? `${added} document${added === 1 ? '' : 's'} indexed locally.` : 'Those documents are already indexed.');
  } catch (error) {
    toast(error.message);
  } finally {
    progress.hidden = true;
    filePicker.value = '';
  }
}

async function removeDocument(doc) {
  try {
    await api(`/api/documents/${encodeURIComponent(doc.id)}`, { method: 'DELETE' });
    selectedDocuments.delete(doc.id);
    documents = documents.filter(item => item.id !== doc.id);
    renderDocuments();
    toast('Document and its local index removed.');
  } catch (error) {
    toast(error.message);
  }
}

function addQuestion(text) {
  const bubble = document.createElement('div');
  bubble.className = 'chat-message';
  bubble.textContent = text;
  conversation.append(bubble);
}

function appendCitedText(container, text, citations) {
  const lookup = new Map(citations.map(source => [source.id, source]));
  const pattern = /\[(S\d+)\]/g;
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    container.append(document.createTextNode(text.slice(cursor, match.index)));
    const source = lookup.get(match[1]);
    if (source) {
      const button = document.createElement('button');
      button.className = 'inline-citation';
      button.type = 'button';
      button.textContent = `[${source.id}]`;
      button.addEventListener('click', () => showSource(source));
      container.append(button);
    } else {
      container.append(document.createTextNode(match[0]));
    }
    cursor = match.index + match[0].length;
  }
  container.append(document.createTextNode(text.slice(cursor)));
}

function showSource(source) {
  document.getElementById('sourceTitle').textContent = source.filename;
  document.getElementById('sourceLocation').textContent = source.locator;
  document.getElementById('sourceExcerpt').textContent = source.excerpt;
  const modal = document.getElementById('sourceModal');
  modal.classList.add('visible');
  modal.setAttribute('aria-hidden', 'false');
}

function renderAnswer(data) {
  const card = document.createElement('article');
  card.className = 'answer-card';
  const label = document.createElement('div');
  label.className = 'answer-label';
  label.textContent = 'AI DRAFT · REVIEW BEFORE SHARING';
  const answer = document.createElement('div');
  answer.className = 'answer-body';
  appendCitedText(answer, data.answer, data.citations || []);
  card.append(label, answer);
  if (data.citations?.length) {
    const sources = document.createElement('div');
    sources.className = 'sources';
    const title = document.createElement('div');
    title.className = 'sources-title';
    title.textContent = `SUPPORTING PASSAGES · ${data.citations.length}`;
    sources.append(title);
    data.citations.forEach(source => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'source-card';
      const file = document.createElement('strong');
      file.textContent = `[${source.id}] ${source.filename}`;
      const locator = document.createElement('small');
      locator.textContent = source.locator;
      const excerpt = document.createElement('p');
      excerpt.textContent = source.excerpt;
      button.append(file, locator, excerpt);
      button.addEventListener('click', () => showSource(source));
      sources.append(button);
    });
    card.append(sources);
  }
  conversation.append(card);
  conversation.scrollTop = conversation.scrollHeight;
}

document.getElementById('filePicker').addEventListener('change', event => uploadFiles(event.target.files));
const dropzone = document.getElementById('dropzone');
dropzone.addEventListener('dragover', event => { event.preventDefault(); dropzone.classList.add('dragging'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragging'));
dropzone.addEventListener('drop', event => {
  event.preventDefault();
  dropzone.classList.remove('dragging');
  uploadFiles(event.dataTransfer.files);
});
document.getElementById('selectAllBtn').addEventListener('click', () => {
  if (selectedDocuments.size === documents.length) selectedDocuments.clear();
  else documents.forEach(doc => selectedDocuments.add(doc.id));
  renderDocuments();
});
questionInput.addEventListener('input', updateComposer);
questionInput.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    document.getElementById('questionForm').requestSubmit();
  }
});
document.querySelectorAll('.suggestions button').forEach(button => button.addEventListener('click', () => {
  questionInput.value = button.textContent;
  questionInput.focus();
  updateComposer();
}));
document.getElementById('questionForm').addEventListener('submit', async event => {
  event.preventDefault();
  const question = questionInput.value.trim();
  if (!question || !selectedDocuments.size) return;
  if (welcomeState?.isConnected) welcomeState.remove();
  addQuestion(question);
  questionInput.value = '';
  askButton.dataset.busy = 'true';
  askButton.textContent = 'Searching…';
  const waiting = document.createElement('div');
  waiting.className = 'answer-error';
  waiting.textContent = 'Searching the selected files and drafting a cited answer locally…';
  conversation.append(waiting);
  conversation.scrollTop = conversation.scrollHeight;
  updateComposer();
  try {
    const result = await api('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, document_ids: [...selectedDocuments] }),
    });
    waiting.remove();
    renderAnswer(result);
  } catch (error) {
    waiting.className = 'answer-error';
    waiting.textContent = error.message;
  } finally {
    askButton.dataset.busy = 'false';
    askButton.innerHTML = 'Ask assistant <span>↑</span>';
    updateComposer();
    questionInput.focus();
  }
});
document.getElementById('clearChat').addEventListener('click', () => {
  conversation.replaceChildren(welcomeState);
  toast('Conversation cleared.');
});
function closeSource() {
  const modal = document.getElementById('sourceModal');
  modal.classList.remove('visible');
  modal.setAttribute('aria-hidden', 'true');
}
document.getElementById('closeSource').addEventListener('click', closeSource);
document.getElementById('sourceModal').addEventListener('click', event => { if (event.target.id === 'sourceModal') closeSource(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeSource(); });

refreshHealth();
refreshDocuments().catch(error => toast(error.message));
