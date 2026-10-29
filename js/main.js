const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
function closeMenu() {
  navigation.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Открыть меню');
}
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', expanded);
  menuToggle.setAttribute('aria-expanded', String(expanded));
  menuToggle.setAttribute('aria-label', expanded ? 'Закрыть меню' : 'Открыть меню');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
});
const photoDialog = document.querySelector('#photo-dialog');
document.querySelectorAll('[data-photo]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const image = photoDialog.querySelector('img');
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    photoDialog.showModal();
  });
});

const phoneButton = document.querySelector('[data-copy-phone]');
const copyStatus = document.querySelector('.copy-status');
let copyStatusTimer;

phoneButton?.addEventListener('click', async () => {
  const phone = phoneButton.dataset.copyPhone;
  let copied = false;
  try {
    await navigator.clipboard.writeText(phone);
    copied = true;
  } catch {
    // Fallback for browsers without the Clipboard API.
    const field = document.createElement('textarea');
    field.value = phone;
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.append(field);
    field.select();
    field.setSelectionRange(0, phone.length);
    try { copied = document.execCommand('copy'); } catch { copied = false; }
    field.remove();
    phoneButton.focus({ preventScroll: true });
  }
  clearTimeout(copyStatusTimer);
  copyStatus.textContent = copied ? 'Номер скопирован' : 'Не удалось скопировать: +7 922 227-33-31';
  copyStatusTimer = setTimeout(() => { copyStatus.textContent = ''; }, 4000);
});
