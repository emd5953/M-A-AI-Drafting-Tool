const toast = document.getElementById('toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

const tabs = [...document.querySelectorAll('.tab')];
const rows = [...document.querySelectorAll('#fileRows tr')];
let activeTab = 'all';
let flaggedOnly = false;
function filterRows() {
  const query = document.getElementById('docSearch').value.trim().toLowerCase();
  rows.forEach(row => {
    const matchesTab = activeTab === 'all' || row.dataset.kind.split(' ').includes(activeTab);
    const matchesFlag = !flaggedOnly || row.dataset.kind.includes('flagged');
    const matchesQuery = !query || row.textContent.toLowerCase().includes(query);
    row.hidden = !(matchesTab && matchesFlag && matchesQuery);
  });
}
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(item => item.classList.toggle('active', item === tab));
  activeTab = tab.dataset.tab;
  flaggedOnly = false;
  filterRows();
}));
document.getElementById('docSearch').addEventListener('input', filterRows);
document.getElementById('searchToggle').addEventListener('click', () => {
  const search = document.getElementById('searchRow');
  search.classList.toggle('visible');
  if (search.classList.contains('visible')) document.getElementById('docSearch').focus();
});
document.getElementById('filterBtn').addEventListener('click', event => {
  flaggedOnly = !flaggedOnly;
  event.currentTarget.classList.toggle('filter-active', flaggedOnly);
  showToast(flaggedOnly ? 'Showing flagged documents' : 'All document filters cleared');
  filterRows();
});

const fileInput = document.getElementById('fileInput');
document.getElementById('uploadBtn').addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  const files = [...fileInput.files];
  if (!files.length) return;
  files.forEach(file => {
    const ext = file.name.split('.').pop().toLowerCase();
    const type = ext === 'pdf' ? 'pdf' : ['xls', 'xlsx', 'csv'].includes(ext) ? 'xlsx' : 'docx';
    const label = type === 'pdf' ? 'P' : type === 'xlsx' ? 'X' : 'W';
    const row = document.createElement('tr');
    row.dataset.kind = 'all';
    row.innerHTML = `<td><div class="file-name"><span class="file-type ${type}">${label}</span><span><strong></strong><small></small></span></div></td><td><span class="status-chip shared">Shared</span></td><td><span class="date-main">Just now</span><span class="date-sub">Version 1.0</span></td><td><div class="owner"><span class="avatar avatar-user small-avatar">JL</span><span>Jordan Lee</span></div></td><td><button class="row-more" aria-label="Document options">···</button></td>`;
    row.querySelector('.file-name strong').textContent = file.name.replace(/\.[^.]+$/, '');
    row.querySelector('.file-name small').textContent = file.name;
    document.getElementById('fileRows').prepend(row);
    rows.unshift(row);
  });
  filterRows();
  showToast(`${files.length} ${files.length === 1 ? 'file' : 'files'} added to Project Northstar`);
  fileInput.value = '';
});

const backdrop = document.getElementById('modalBackdrop');
function openModal(title, message) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalText').textContent = message;
  backdrop.classList.add('visible');
}
function closeModal() { backdrop.classList.remove('visible'); }
document.getElementById('aiBtn').addEventListener('click', () => { window.location.href = '/ai'; });
document.getElementById('inviteBtn').addEventListener('click', () => openModal('Bring your deal team in.', 'Invite a buyer or seller side teammate to collaborate in the Project Northstar deal room.'));
document.getElementById('teamBtn').addEventListener('click', () => openModal('Your deal team.', 'Manage buyer and seller participants, roles, and access for Project Northstar.'));
document.getElementById('modalClose').addEventListener('click', closeModal);
backdrop.addEventListener('click', event => { if (event.target === backdrop) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
document.getElementById('modalSend').addEventListener('click', () => {
  const prompt = document.getElementById('modalPrompt');
  if (!prompt.value.trim()) { prompt.focus(); return; }
  const question = prompt.value.trim();
  closeModal();
  prompt.value = '';
  showToast(`AI assistant is ready to help with: “${question.slice(0, 44)}${question.length > 44 ? '…' : ''}”`);
});
document.querySelectorAll('.suggestion-row button').forEach(button => button.addEventListener('click', () => {
  document.getElementById('modalPrompt').value = button.textContent === 'Draft a response' ? 'Draft a response to the latest SPA comments' : 'Summarize the open diligence issues';
  document.getElementById('modalPrompt').focus();
}));

document.getElementById('stageBtn').addEventListener('click', () => showToast('Due diligence is in progress · Target close Dec 19, 2025'));
document.querySelectorAll('.row-more').forEach(button => button.addEventListener('click', () => showToast('Document actions: open, download, or share')));
document.querySelectorAll('.attention-item').forEach(button => button.addEventListener('click', () => showToast(`${button.querySelector('strong').textContent} · Opening deal task`)));
document.querySelectorAll('.nav-item,.deal-link').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  const name = link.textContent.trim().replace(/\s+\d+$/, '');
  if (name && !name.includes('Project Northstar')) showToast(`${name} view is coming up next`);
}));
document.querySelector('.table-footer button').addEventListener('click', () => showToast('Showing the latest documents in this deal room'));
document.querySelector('.all-tasks').addEventListener('click', () => showToast('All open deal tasks are up to date'));
document.querySelector('.text-button').addEventListener('click', () => showToast('Showing the latest activity in Project Northstar'));
document.querySelectorAll('.dots,.more-btn,.plus').forEach(button => button.addEventListener('click', () => showToast('Deal room options')));
