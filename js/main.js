// Set a real booking URL here when the contact details are available.
const BOOKING_URL = '';

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
const bookingDialog = document.querySelector('#booking-dialog');
document.querySelectorAll('[data-booking]').forEach(button => {
  button.addEventListener('click', () => {
    closeMenu();
    if (BOOKING_URL) { window.location.assign(BOOKING_URL); return; }
    bookingDialog.showModal();
  });
});
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
});
document.querySelector('.dialog-dismiss').addEventListener('click', () => bookingDialog.close());
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
