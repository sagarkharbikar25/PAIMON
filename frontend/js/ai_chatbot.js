/* =============================================
   ai_chatbot.js
   Pravas — AI Chatbot (connected to backend)
   ============================================= */

import { guardRoute } from './auth.js';
import { api } from './api.js';

guardRoute(null, '/html/login.html');

const params      = new URLSearchParams(window.location.search);
const destination = params.get('destination') || '';

tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "tertiary-fixed": "#ffdbcb", "on-secondary-container": "#4e6874",
        "surface-bright": "#f6fafe", "inverse-on-surface": "#edf1f5",
        "on-primary": "#ffffff", "surface": "#f6fafe", "on-tertiary": "#ffffff",
        "on-error": "#ffffff", "surface-variant": "#dfe3e7",
        "secondary-fixed": "#cbe7f5", "outline": "#737784",
        "surface-container-high": "#e4e9ed", "inverse-primary": "#b1c5ff",
        "primary": "#00327d", "tertiary": "#602400", "on-secondary-fixed": "#021f29",
        "secondary-container": "#cbe7f5", "tertiary-container": "#843500",
        "surface-container": "#eaeef2", "background": "#f6fafe",
        "primary-fixed": "#dae2ff", "on-surface": "#171c1f",
        "surface-container-low": "#f0f4f8", "error-container": "#ffdad6",
        "primary-container": "#0047ab", "outline-variant": "#c3c6d5",
        "surface-container-highest": "#dfe3e7", "on-surface-variant": "#434653",
        "surface-container-lowest": "#ffffff", "on-secondary": "#ffffff",
        "primary-fixed-dim": "#b1c5ff", "on-tertiary-container": "#ffaa80",
        "inverse-surface": "#2c3134", "secondary-fixed-dim": "#afcbd8",
        "surface-tint": "#2559bd", "on-background": "#171c1f",
        "secondary": "#48626e", "error": "#ba1a1a",
        "on-primary-container": "#a5bdff", "surface-dim": "#d6dade"
      },
      fontFamily: { "headline": ["Plus Jakarta Sans"], "body": ["Inter"], "label": ["Inter"] },
      borderRadius: { "DEFAULT": "0.25rem", "lg": "1rem", "xl": "1.5rem", "full": "9999px" },
    },
  },
};

document.addEventListener('DOMContentLoaded', function () {

  const chatInput      = document.getElementById('chat-input');
  const sendBtn        = document.getElementById('send-btn');
  const chatMessages   = document.getElementById('chat-messages');
  const chatCanvas     = document.getElementById('chat-canvas');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');
  const navTabs        = document.querySelectorAll('.nav-tab');
  const bottomNavBtns  = document.querySelectorAll('.bottom-nav-btn');
  const menuBtn        = document.querySelector('.menu-btn');

  function getCurrentTime() {
    const now     = new Date();
    let hours     = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm    = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  function scrollToBottom() { chatCanvas.scrollTop = chatCanvas.scrollHeight; }

  function escapeHtml(text) {
    return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'flex flex-col items-end max-w-[85%] ml-auto';
    div.innerHTML = `
      <div class="bg-primary p-5 rounded-xl rounded-tr-none shadow-lg">
        <p class="text-on-primary leading-relaxed">${escapeHtml(text)}</p>
      </div>
      <span class="text-[10px] text-on-surface-variant mt-2 px-1 font-medium uppercase tracking-widest">${getCurrentTime()}</span>`;
    chatMessages.appendChild(div);
    scrollToBottom();
  }

  function addAIMessage(text) {
    const div = document.createElement('div');
    div.className = 'flex flex-col items-start max-w-[85%] animate-fade-in';
    div.innerHTML = `
      <div class="flex items-center gap-3 mb-2 px-1">
        <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
          <span class="material-symbols-outlined text-sm">auto_awesome</span>
        </div>
        <span class="font-headline font-bold text-sm tracking-tight text-primary">प्रvaas Concierge</span>
      </div>
      <div class="bg-surface-container-lowest p-5 rounded-xl rounded-tl-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant/10">
        <p class="text-on-surface leading-relaxed">${escapeHtml(text)}</p>
      </div>
      <span class="text-[10px] text-on-surface-variant mt-2 px-1 font-medium uppercase tracking-widest">${getCurrentTime()}</span>`;
    chatMessages.appendChild(div);
    scrollToBottom();
  }

  function addTypingIndicator() {
    const div = document.createElement('div');
    div.id = 'typing-indicator';
    div.className = 'flex flex-col items-start max-w-[85%]';
    div.innerHTML = `
      <div class="flex items-center gap-3 mb-2 px-1">
        <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
          <span class="material-symbols-outlined text-sm">auto_awesome</span>
        </div>
        <span class="font-headline font-bold text-sm tracking-tight text-primary">प्रvaas Concierge</span>
      </div>
      <div class="bg-surface-container-lowest p-4 rounded-xl rounded-tl-none border border-outline-variant/10">
        <span class="flex gap-1">
          <span class="w-2 h-2 bg-outline rounded-full animate-bounce" style="animation-delay:0ms"></span>
          <span class="w-2 h-2 bg-outline rounded-full animate-bounce" style="animation-delay:150ms"></span>
          <span class="w-2 h-2 bg-outline rounded-full animate-bounce" style="animation-delay:300ms"></span>
        </span>
      </div>`;
    chatMessages.appendChild(div);
    scrollToBottom();
    return div;
  }

  // ── Send → POST /api/chatbot/ask ─────────────────────────────────────────
  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addUserMessage(text);
    chatInput.value  = '';
    sendBtn.disabled = true;

    const typing = addTypingIndicator();

    try {
      const { result } = await api.askChatbot(text, destination);
      typing.remove();
      addAIMessage(result);
    } catch (err) {
      typing.remove();
      addAIMessage('Sorry, I could not get a response right now. Please try again.');
      console.error(err);
    } finally {
      sendBtn.disabled = false;
      chatInput.focus();
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } });

  suggestionChips.forEach(chip => {
    chip.addEventListener('click', function () {
      chatInput.value = this.textContent.trim();
      sendMessage();
    });
  });

  navTabs.forEach(tab => {
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      navTabs.forEach(t => { t.classList.remove('text-[#00327d]','border-b-2','border-primary'); t.classList.add('text-slate-500'); });
      this.classList.remove('text-slate-500');
      this.classList.add('text-[#00327d]','border-b-2','border-primary');
    });
  });

  bottomNavBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      bottomNavBtns.forEach(b => {
        b.classList.remove('bg-[#cbe7f5]','text-[#00327d]','rounded-2xl','scale-105');
        b.classList.add('text-slate-400');
        b.querySelector('.material-symbols-outlined').style.fontVariationSettings = "'FILL' 0";
      });
      this.classList.remove('text-slate-400');
      this.classList.add('bg-[#cbe7f5]','text-[#00327d]','rounded-2xl','scale-105');
      this.querySelector('.material-symbols-outlined').style.fontVariationSettings = "'FILL' 1";
    });
  });

  if (menuBtn) menuBtn.addEventListener('click', () => {});
  scrollToBottom();
});