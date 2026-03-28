/* =============================================
   Upload Ticket — JavaScript (DOM logic only)
   Note: Tailwind config lives in upload-ticket.html
         as a <script> block BEFORE the CDN script.
   ============================================= */

// ── Element References ─────────────────────────────────────────────────────
var dropZone    = document.getElementById('dropZone');
var fileInput   = document.getElementById('fileInput');
var browseBtn   = document.getElementById('browseBtn');
var cameraBtn   = document.getElementById('cameraBtn');
var galleryBtn  = document.getElementById('galleryBtn');
var pdfBtn      = document.getElementById('pdfBtn');
var doneBtn     = document.getElementById('doneBtn');
var backBtn     = document.getElementById('backBtn');
var viewAllBtn  = document.getElementById('viewAllBtn');
var uploadList  = document.getElementById('uploadList');
var moreMenuBtns = document.querySelectorAll('.more-menu-btn');
var navItems    = document.querySelectorAll('.nav-item');

// ── Bottom Nav: active tab switching ──────────────────────────────────────
navItems.forEach(function(item) {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    navItems.forEach(function(n) {
      n.classList.remove('nav-active', 'text-[#00327d]', 'bg-[#0047AB]/10', 'rounded-2xl');
      n.classList.add('text-slate-400');
    });
    item.classList.add('nav-active', 'text-[#00327d]', 'bg-[#0047AB]/10', 'rounded-2xl');
    item.classList.remove('text-slate-400');
  });
});

// ── Browse Files Button → triggers hidden file input ──────────────────────
browseBtn.addEventListener('click', function() {
  fileInput.click();
});

// ── File Input: handle selected files ─────────────────────────────────────
fileInput.addEventListener('change', function() {
  handleFiles(fileInput.files);
});

// ── Drag & Drop on Drop Zone ───────────────────────────────────────────────
dropZone.addEventListener('dragover', function(e) {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', function() {
  dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', function(e) {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  var files = e.dataTransfer.files;
  handleFiles(files);
});

// ── Take Photo (camera capture) ────────────────────────────────────────────
cameraBtn.addEventListener('click', function() {
  var camInput = document.createElement('input');
  camInput.type = 'file';
  camInput.accept = 'image/*';
  camInput.capture = 'environment';
  camInput.addEventListener('change', function() {
    handleFiles(camInput.files);
  });
  camInput.click();
});

// ── Gallery ────────────────────────────────────────────────────────────────
galleryBtn.addEventListener('click', function() {
  var galInput = document.createElement('input');
  galInput.type = 'file';
  galInput.accept = 'image/*';
  galInput.multiple = true;
  galInput.addEventListener('change', function() {
    handleFiles(galInput.files);
  });
  galInput.click();
});

// ── Import PDF ─────────────────────────────────────────────────────────────
pdfBtn.addEventListener('click', function() {
  var pdfInput = document.createElement('input');
  pdfInput.type = 'file';
  pdfInput.accept = '.pdf';
  pdfInput.multiple = true;
  pdfInput.addEventListener('change', function() {
    handleFiles(pdfInput.files);
  });
  pdfInput.click();
});

// ── Handle Files: add to Recent Uploads list ───────────────────────────────
function handleFiles(files) {
  if (!files || files.length === 0) return;

  Array.from(files).forEach(function(file) {
    var allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      alert('Unsupported file type: ' + file.name + '\nPlease upload PDF, JPG, or PNG.');
      return;
    }

    var sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    var sizeLabel = file.size > 1024 * 1024
      ? sizeMB + ' MB'
      : Math.round(file.size / 1024) + ' KB';

    // Build new upload item row
    var item = document.createElement('div');
    item.className = 'upload-item flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/10';
    item.innerHTML =
      '<div class="flex items-center gap-4">' +
        '<div class="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center">' +
          '<span class="material-symbols-outlined text-primary">' +
            (file.type === 'application/pdf' ? 'picture_as_pdf' : 'image') +
          '</span>' +
        '</div>' +
        '<div>' +
          '<p class="font-bold text-sm">' + file.name + '</p>' +
          '<p class="text-xs text-on-surface-variant">Just now • ' + sizeLabel + '</p>' +
        '</div>' +
      '</div>' +
      '<span class="material-symbols-outlined text-on-surface-variant cursor-pointer more-menu-btn">more_vert</span>';

    // Insert at top of list
    uploadList.insertBefore(item, uploadList.firstChild);

    // Bind more-menu on new item
    item.querySelector('.more-menu-btn').addEventListener('click', function() {
      showMoreMenu(file.name);
    });
  });
}

// ── More Menu (⋮) on each upload item ─────────────────────────────────────
moreMenuBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    var name = btn.closest('.upload-item').querySelector('.font-bold').textContent;
    showMoreMenu(name);
  });
});

function showMoreMenu(filename) {
  var action = confirm('"' + filename + '"\n\nClick OK to Delete, or Cancel to dismiss.');
  if (action) {
    alert('"' + filename + '" deleted.');
  }
}

// ── Done / Check FAB ──────────────────────────────────────────────────────
doneBtn.addEventListener('click', function() {
  doneBtn.classList.add('done-pulse');
  setTimeout(function() {
    doneBtn.classList.remove('done-pulse');
  }, 300);
  alert('Tickets saved to your Travel Vault!');
});

// ── Back Button ───────────────────────────────────────────────────────────
backBtn.addEventListener('click', function() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    alert('No previous page to go back to.');
  }
});

// ── View All Button ───────────────────────────────────────────────────────
viewAllBtn.addEventListener('click', function() {
  alert('Full uploads gallery coming soon!');
});