/* =============================================
   Weather & Alerts — JavaScript (DOM logic only)
   Note: Tailwind config lives in weather.html
         <script> tag BEFORE the CDN script.
   ============================================= */

// ── Bottom Nav: active tab switching ──────────────────────────────────────
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(function(item) {
  item.addEventListener('click', function(e) {
    e.preventDefault();

    navItems.forEach(function(n) {
      n.classList.remove('nav-active', 'bg-[#cbe7f5]', 'text-[#00327d]', 'rounded-2xl', 'scale-105');
      n.classList.add('text-slate-400');
    });

    item.classList.add('nav-active', 'bg-[#cbe7f5]', 'text-[#00327d]', 'rounded-2xl', 'scale-105');
    item.classList.remove('text-slate-400');
  });
});

// ── "Notify me later" button ───────────────────────────────────────────────
var notifyBtn = document.getElementById('notifyBtn');
if (notifyBtn) {
  notifyBtn.addEventListener('click', function() {
    notifyBtn.textContent = '✓ You will be notified';
    notifyBtn.disabled = true;
    notifyBtn.style.opacity = '0.6';
    notifyBtn.style.cursor = 'not-allowed';
  });
}

// ── "View Heatmap" button ──────────────────────────────────────────────────
var heatmapBtn = document.getElementById('heatmapBtn');
if (heatmapBtn) {
  heatmapBtn.addEventListener('click', function() {
    alert('Heatmap view coming soon!');
  });
}

// ── "Share" button ─────────────────────────────────────────────────────────
var shareBtn = document.getElementById('shareBtn');
if (shareBtn) {
  shareBtn.addEventListener('click', function() {
    var text = 'High crowds in Gion – Heavy pedestrian traffic around Yasaka Shrine. Expect delays of 20-30 minutes.';
    if (navigator.share) {
      navigator.share({ title: 'Crowd Warning', text: text, url: window.location.href });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function() {
        alert('Alert copied to clipboard!');
      });
    } else {
      alert('Share not supported on this browser.');
    }
  });
}

// ── "Full Details" button ──────────────────────────────────────────────────
var fullDetailsBtn = document.getElementById('fullDetailsBtn');
if (fullDetailsBtn) {
  fullDetailsBtn.addEventListener('click', function() {
    alert('Full 10-day forecast coming soon!');
  });
}

// ── Live "last updated" timer ──────────────────────────────────────────────
var infoText = document.getElementById('infoText');
if (infoText) {
  var minutesAgo = 2;
  setInterval(function() {
    minutesAgo++;
    infoText.textContent = 'Data updated ' + minutesAgo + ' minute' + (minutesAgo !== 1 ? 's' : '') + ' ago. Powered by Kyoto Meteorological Center.';
  }, 60000);
}