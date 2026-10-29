// Each carousel works independently. All content remains in gallery.html.
document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const viewport = carousel.querySelector('[data-carousel-viewport]');
  const track = carousel.querySelector('.carousel-track');
  const slides = [...track.children];
  const thumbnails = [...carousel.querySelectorAll('[data-slide]')];
  const thumbnailStrip = carousel.querySelector('.carousel-thumbnails');
  const counter = carousel.querySelector('.carousel-counter');
  const status = carousel.querySelector('.carousel-status');
  const name = carousel.getAttribute('aria-label');
  let index = 0;
  let pointerStart = null;

  function showSlide(next) {
    index = (next + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === index;
      slide.setAttribute('aria-hidden', String(!active));
      slide.inert = !active;
    });
    thumbnails.forEach((button, buttonIndex) => {
      button.setAttribute('aria-pressed', String(buttonIndex === index));
    });
    const activeThumbnail = thumbnails[index];
    const stripBounds = thumbnailStrip.getBoundingClientRect();
    const thumbnailBounds = activeThumbnail.getBoundingClientRect();
    const targetLeft = thumbnailStrip.scrollLeft + thumbnailBounds.left - stripBounds.left
      - (thumbnailStrip.clientWidth - thumbnailBounds.width) / 2;
    thumbnailStrip.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    status.textContent = `Фото ${index + 1} из ${slides.length} — ${name}`;
  }

  carousel.querySelectorAll('[data-direction]').forEach(button => {
    button.addEventListener('click', () => showSlide(index + Number(button.dataset.direction)));
  });
  thumbnails.forEach(button => {
    button.addEventListener('click', () => showSlide(Number(button.dataset.slide)));
  });
  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showSlide(index - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showSlide(index + 1); }
    if (event.key === 'Home') { event.preventDefault(); showSlide(0); }
    if (event.key === 'End') { event.preventDefault(); showSlide(slides.length - 1); }
  });
  viewport.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
    viewport.setPointerCapture(event.pointerId);
  });
  viewport.addEventListener('pointerup', event => {
    if (!pointerStart || event.pointerId !== pointerStart.id) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      showSlide(index + (dx < 0 ? 1 : -1));
    }
  });
  viewport.addEventListener('pointercancel', () => { pointerStart = null; });
  viewport.addEventListener('dragstart', event => event.preventDefault());
});
