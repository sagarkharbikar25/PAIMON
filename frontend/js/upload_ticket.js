/* ============================================================
   upload_ticket.js
   Interactivity for frontend/html/upload_ticket.html
   Part of: प्रvaas — Smart India Hackathon 2025
   ============================================================ */


/* ── DOM refs ──────────────────────────────────────────────── */

const dropZone     = document.getElementById('drop-zone');
const fileInput    = document.getElementById('file-input');
const browseBtn    = document.getElementById('browse-btn');
const btnCamera    = document.getElementById('btn-camera');
const btnGallery   = document.getElementById('btn-gallery');
const btnPdf       = document.getElementById('btn-pdf');
const uploadsList  = document.getElementById('uploads-list');
const viewAllBtn   = document.getElementById('view-all-btn');
const fabDone      = document.getElementById('fab-done');


/* ── Toast helper ──────────────────────────────────────────── */

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}


/* ── Browse / file input ───────────────────────────────────── */

browseBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
  handleFiles(Array.from(e.target.files));
  fileInput.value = ''; // reset so same file can be re-selected
});


/* ── Drag & Drop ───────────────────────────────────────────── */

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  const files = Array.from(e.dataTransfer.files).filter(isValidFile);
  if (files.length) {
    handleFiles(files);
  } else {
    showToast('Only PDF, JPG, or PNG files are supported.');
  }
});


/* ── Fast action buttons ───────────────────────────────────── */

btnCamera.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.capture = 'environment';
  input.addEventListener('change', (e) => handleFiles(Array.from(e.target.files)));
  input.click();
});

btnGallery.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.multiple = true;
  input.addEventListener('change', (e) => handleFiles(Array.from(e.target.files)));
  input.click();
});

btnPdf.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.pdf';
  input.multiple = true;
  input.addEventListener('change', (e) => handleFiles(Array.from(e.target.files)));
  input.click();
});


/* ── File validation ───────────────────────────────────────── */

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_SIZE_MB   = 10;

function isValidFile(file) {
  return ALLOWED_TYPES.includes(file.type) && file.size <= MAX_SIZE_MB * 1024 * 1024;
}


/* ── Handle uploaded files ─────────────────────────────────── */

function handleFiles(files) {
  const valid = files.filter(isValidFile);
  const invalid = files.length - valid.length;

  if (invalid > 0) {
    showToast(`${invalid} file(s) skipped — only PDF/JPG/PNG under ${MAX_SIZE_MB}MB allowed.`);
  }

  valid.forEach((file) => {
    addUploadRow(file);
    simulateUpload(file);
  });
}


/* ── Add upload row to Recent Uploads list ─────────────────── */

function addUploadRow(file) {
  const isPdf = file.type === 'application/pdf';
  const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
  const preview = isPdf ? null : URL.createObjectURL(file);

  const row = document.createElement('div');
  row.classList.add(
    'upload-item', 'flex', 'items-center', 'justify-between',
    'p-4', 'bg-surface-container-lowest', 'rounded-xl',
    'border', 'border-outline-variant/10'
  );
  row.dataset.filename = file.name;

  row.innerHTML = `
    <div class="flex items-center gap-4 flex-1 min-w-0">
      <div class="w-12 h-12 rounded-lg overflow-hidden bg-surface-container flex-shrink-0 flex items-center justify-center">
        ${preview
          ? `<img src="${preview}" alt="Ticket Preview" class="w-full h-full object-cover"/>`
          : `<span class="material-symbols-outlined text-primary">picture_as_pdf</span>`
        }
      </div>
      <div class="min-w-0">
        <p class="font-bold text-sm truncate">${file.name}</p>
        <p class="text-xs text-on-surface-variant">Uploading… • ${sizeMB} MB</p>
        <div class="upload-progress-track">
          <div class="upload-progress-bar" style="width:0%"></div>
        </div>
      </div>
    </div>
    <span class="material-symbols-outlined text-on-surface-variant cursor-pointer upload-menu-btn ml-4">more_vert</span>
  `;

  uploadsList.prepend(row);
}


/* ── Simulate upload progress ──────────────────────────────── */

function simulateUpload(file) {
  const rows = uploadsList.querySelectorAll('.upload-item');
  const row = rows[0]; // most recently prepended
  const bar = row.querySelector('.upload-progress-bar');
  const meta = row.querySelectorAll('p')[1];

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      bar.style.width = '100%';
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      meta.textContent = `Uploaded just now • ${sizeMB} MB`;
      row.querySelector('.upload-progress-track').remove();
      showToast(`${file.name} uploaded successfully.`);
    } else {
      bar.style.width = `${progress}%`;
    }
  }, 200);
}


/* ── Context menu on more_vert (upload-menu-btn) ───────────── */

uploadsList.addEventListener('click', (e) => {
  if (e.target.classList.contains('upload-menu-btn')) {
    const row = e.target.closest('.upload-item');
    const filename = row?.dataset.filename || 'this file';
    const action = window.confirm(`Delete "${filename}"?`);
    if (action) {
      row.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      row.style.opacity = '0';
      row.style.transform = 'translateX(20px)';
      setTimeout(() => row.remove(), 220);
      showToast(`${filename} removed.`);
    }
  }
});


/* ── View All button ───────────────────────────────────────── */

viewAllBtn.addEventListener('click', () => {
  showToast('All uploads — coming soon.');
});


/* ── FAB — Done / confirm uploads ─────────────────────────── */

fabDone.addEventListener('click', () => {
  const inProgress = uploadsList.querySelectorAll('.upload-progress-track');
  if (inProgress.length > 0) {
    showToast('Please wait — uploads still in progress.');
    return;
  }
  showToast('Tickets saved to your vault!');
  // TODO: navigate to itinerary page
  // window.location.href = 'itinerary.html';
});