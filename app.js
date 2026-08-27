const sidebar = document.getElementById('sidebar');
const menuButton = document.getElementById('menuButton');
const toast = document.getElementById('toast');

menuButton?.addEventListener('click', () => sidebar.classList.toggle('open'));

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');
    sidebar.classList.remove('open');
  });
});

function demoMessage(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(window.__toastTimer);
  window.__toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

document.getElementById('continueButton')?.addEventListener('click', () => {
  document.getElementById('learn')?.scrollIntoView({ behavior: 'smooth' });
  demoMessage('Lesson 2 ready — interactive learning is next.');
});

document.getElementById('lessonButton')?.addEventListener('click', () => {
  demoMessage('Lesson player coming next — the shell is live.');
});

document.querySelectorAll('.ghost-button').forEach(button => {
  button.addEventListener('click', () => demoMessage('This module is part of the UnlockingDeFi roadmap.'));
});