/* =============================================
   upload_ticket.js
   Pravas — Upload Ticket (connected to backend)
   ============================================= */

import { guardRoute, getCurrentUser } from './auth.js';
import { getToken } from './api.js';

const BASE_URL = 'http://localhost:5000/api';

/* ── Route Guard ─────────────────────────────*/
guardRoute(null, '/html/login.html');

/* ── DOM Ready ───────────────────────────────*/
document.addEventListener('DOMContentLoaded', function () {

    /* Load user avatar */
    const user = getCurrentUser();
    if (user) {
        const avatarEl = document.getElementById('user-avatar');
        if (avatarEl && user.photoUrl) avatarEl.src = user.photoUrl;
    }

    /* ── DOM refs ──────────────────────────── */
    const dropZone    = document.getElementById('drop-zone');
    const fileInput   = document.getElementById('file-input');
    const browseBtn   = document.getElementById('browse-btn');
    const btnCamera   = document.getElementById('btn-camera');
    const btnGallery  = document.getElementById('btn-gallery');
    const btnPdf      = document.getElementById('btn-pdf');
    const uploadsList = document.getElementById('uploads-list');
    const viewAllBtn  = document.getElementById('view-all-btn');
    const fabDone     = document.getElementById('fab-done');
    const backBtn     = document.getElementById('back-btn');

    /* ── Back button ───────────────────────── */
    if (backBtn) backBtn.addEventListener('click', () => window.history.back());

    /* ── Toast helper ──────────────────────── */
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

    /* ── Browse / file input ───────────────── */
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        handleFiles(Array.from(e.target.files));
        fileInput.value = '';
    });

    /* ── Drag & Drop ───────────────────────── */
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files).filter(isValidFile);
        files.length ? handleFiles(files) : showToast('Only PDF, JPG, or PNG files are supported.');
    });

    /* ── Fast action buttons ───────────────── */
    btnCamera.addEventListener('click', () => triggerInput('image/*', false, true));
    btnGallery.addEventListener('click', () => triggerInput('image/*', true));
    btnPdf.addEventListener('click',    () => triggerInput('.pdf', true));

    function triggerInput(accept, multiple = false, capture = false) {
        const input   = document.createElement('input');
        input.type    = 'file';
        input.accept  = accept;
        input.multiple = multiple;
        if (capture) input.capture = 'environment';
        input.addEventListener('change', (e) => handleFiles(Array.from(e.target.files)));
        input.click();
    }

    /* ── Validation ────────────────────────── */
    const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
    const MAX_SIZE_MB   = 10;

    function isValidFile(file) {
        return ALLOWED_TYPES.includes(file.type) && file.size <= MAX_SIZE_MB * 1024 * 1024;
    }

    /* ── Handle files ──────────────────────── */
    function handleFiles(files) {
        const valid   = files.filter(isValidFile);
        const invalid = files.length - valid.length;
        if (invalid > 0) showToast(`${invalid} file(s) skipped — only PDF/JPG/PNG under ${MAX_SIZE_MB}MB.`);
        valid.forEach(uploadToBackend);
    }

    /* ── Upload to backend ─────────────────── */
    async function uploadToBackend(file) {
        const row = addUploadRow(file);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('category', guessCategory(file.name));
            formData.append('label', file.name);

            const token = getToken();
            const xhr   = new XMLHttpRequest();

            /* Track real upload progress */
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const pct = Math.round((e.loaded / e.total) * 100);
                    updateProgress(row, pct);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 201) {
                    const data = JSON.parse(xhr.responseText);
                    finishRow(row, file, data.document);
                    showToast(`${file.name} uploaded successfully.`);
                } else {
                    let msg = 'Upload failed.';
                    try { msg = JSON.parse(xhr.responseText).message || msg; } catch {}
                    failRow(row, msg);
                    showToast(`Upload failed: ${msg}`);
                }
            });

            xhr.addEventListener('error', () => {
                failRow(row, 'Network error.');
                showToast('Upload failed — check your connection.');
            });

            xhr.open('POST', `${BASE_URL}/documents/upload`);
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(formData);

        } catch (err) {
            failRow(row, err.message);
            showToast(`Upload error: ${err.message}`);
        }
    }

    /* ── Guess category from filename ──────── */
    function guessCategory(name) {
        const n = name.toLowerCase();
        if (n.includes('flight') || n.includes('air') || n.includes('boarding')) return 'flight';
        if (n.includes('hotel') || n.includes('booking') || n.includes('stay'))  return 'hotel';
        if (n.includes('train') || n.includes('rail'))                            return 'train';
        if (n.includes('passport'))                                               return 'passport';
        if (n.includes('visa'))                                                   return 'visa';
        if (n.includes('insurance'))                                              return 'insurance';
        return 'other';
    }

    /* ── Add upload row ────────────────────── */
    function addUploadRow(file) {
        const isPdf   = file.type === 'application/pdf';
        const sizeMB  = (file.size / (1024 * 1024)).toFixed(2);
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
                        ? `<img src="${preview}" alt="Preview" class="w-full h-full object-cover"/>`
                        : `<span class="material-symbols-outlined text-primary">picture_as_pdf</span>`
                    }
                </div>
                <div class="min-w-0 flex-1">
                    <p class="font-bold text-sm truncate">${file.name}</p>
                    <p class="row-meta text-xs text-on-surface-variant">Uploading… • ${sizeMB} MB</p>
                    <div class="upload-progress-track">
                        <div class="upload-progress-bar" style="width:0%"></div>
                    </div>
                </div>
            </div>
            <span class="material-symbols-outlined text-on-surface-variant cursor-pointer upload-menu-btn ml-4">more_vert</span>
        `;

        uploadsList.prepend(row);
        return row;
    }

    function updateProgress(row, pct) {
        const bar = row.querySelector('.upload-progress-bar');
        if (bar) bar.style.width = `${pct}%`;
    }

    function finishRow(row, file, doc) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        const meta   = row.querySelector('.row-meta');
        const track  = row.querySelector('.upload-progress-track');
        if (meta)  meta.textContent = `Uploaded just now • ${sizeMB} MB`;
        if (track) track.remove();
        if (doc?._id) row.dataset.docId = doc._id;
    }

    function failRow(row, message) {
        const meta  = row.querySelector('.row-meta');
        const track = row.querySelector('.upload-progress-track');
        if (meta)  { meta.textContent = `Failed: ${message}`; meta.classList.add('text-error'); }
        if (track) track.remove();
    }

    /* ── Delete document ───────────────────── */
    uploadsList.addEventListener('click', async (e) => {
        if (!e.target.classList.contains('upload-menu-btn')) return;

        const row      = e.target.closest('.upload-item');
        const filename = row?.dataset.filename || 'this file';
        const docId    = row?.dataset.docId;

        if (!window.confirm(`Delete "${filename}"?`)) return;

        /* If uploaded to backend — delete from server */
        if (docId) {
            try {
                const token = getToken();
                const res   = await fetch(`${BASE_URL}/documents/${docId}`, {
                    method:  'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) {
                    const data = await res.json();
                    showToast(`Delete failed: ${data.message}`);
                    return;
                }
            } catch {
                showToast('Delete failed — check your connection.');
                return;
            }
        }

        row.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        row.style.opacity    = '0';
        row.style.transform  = 'translateX(20px)';
        setTimeout(() => row.remove(), 220);
        showToast(`${filename} removed.`);
    });

    /* ── Load existing documents ───────────── */
    async function loadDocuments() {
        try {
            const token = getToken();
            const res   = await fetch(`${BASE_URL}/documents`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data  = await res.json();
            if (!data.success || !data.documents.length) return;

            /* Clear placeholder rows and render real ones */
            uploadsList.innerHTML = '';
            data.documents.forEach(renderExistingDoc);
        } catch {
            /* Silently fail — placeholder rows stay */
        }
    }

    function renderExistingDoc(doc) {
        const isImage = doc.fileType.startsWith('image/');
        const sizeMB  = (doc.fileSize / (1024 * 1024)).toFixed(2);
        const date    = new Date(doc.createdAt).toLocaleDateString();

        const row = document.createElement('div');
        row.classList.add(
            'upload-item', 'flex', 'items-center', 'justify-between',
            'p-4', 'bg-surface-container-lowest', 'rounded-xl',
            'border', 'border-outline-variant/10'
        );
        row.dataset.filename = doc.fileName;
        row.dataset.docId    = doc._id;

        row.innerHTML = `
            <div class="flex items-center gap-4 flex-1 min-w-0">
                <div class="w-12 h-12 rounded-lg overflow-hidden bg-surface-container flex-shrink-0 flex items-center justify-center">
                    ${isImage
                        ? `<img src="${doc.fileUrl}" alt="Preview" class="w-full h-full object-cover"/>`
                        : `<span class="material-symbols-outlined text-primary">picture_as_pdf</span>`
                    }
                </div>
                <div class="min-w-0">
                    <p class="font-bold text-sm truncate">${doc.label || doc.fileName}</p>
                    <p class="text-xs text-on-surface-variant">${date} • ${sizeMB} MB</p>
                </div>
            </div>
            <span class="material-symbols-outlined text-on-surface-variant cursor-pointer upload-menu-btn ml-4">more_vert</span>
        `;

        uploadsList.appendChild(row);
    }

    /* ── View All ──────────────────────────── */
    viewAllBtn.addEventListener('click', () => {
        window.location.href = '/html/tickets_documents.html';
    });

    /* ── FAB — Done ────────────────────────── */
    fabDone.addEventListener('click', () => {
        const inProgress = uploadsList.querySelectorAll('.upload-progress-track');
        if (inProgress.length > 0) {
            showToast('Please wait — uploads still in progress.');
            return;
        }
        showToast('Tickets saved to your vault!');
        setTimeout(() => { window.location.href = '/html/tickets_documents.html'; }, 800);
    });

    /* ── Load on page open ─────────────────── */
    loadDocuments();

});