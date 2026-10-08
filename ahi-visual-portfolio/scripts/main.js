(() => {
  const lightbox = document.getElementById('lightbox');
  const image = document.getElementById('lightbox-image');
  const title = document.getElementById('lightbox-title');
  const count = document.getElementById('lightbox-count');
  const closeButton = lightbox.querySelector('.lightbox-close');
  const previousButton = lightbox.querySelector('.lightbox-prev');
  const nextButton = lightbox.querySelector('.lightbox-next');
  const backdrop = lightbox.querySelector('[data-close]');
  const triggers = [...document.querySelectorAll('[data-full][data-gallery]')];
  let group = [];
  let index = 0;
  let opener = null;
  let priorOverflow = '';

  function show(position) {
    index = (position + group.length) % group.length;
    const item = group[index];
    image.src = item.dataset.full;
    image.alt = item.dataset.alt || '';
    title.textContent = item.dataset.title || 'Artwork';
    count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(group.length).padStart(2, '0')}`;
    previousButton.disabled = group.length < 2;
    nextButton.disabled = group.length < 2;
    lightbox.querySelector('.lightbox-content').classList.toggle('single', group.length < 2);
  }

  function open(trigger) {
    opener = trigger;
    group = triggers.filter(item => item.dataset.gallery === trigger.dataset.gallery);
    show(group.indexOf(trigger));
    priorOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lightbox.hidden = false;
    closeButton.focus();
  }

  function close() {
    lightbox.hidden = true;
    image.removeAttribute('src');
    document.body.style.overflow = priorOverflow;
    opener?.focus();
  }

  triggers.forEach(trigger => trigger.addEventListener('click', () => open(trigger)));
  closeButton.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  previousButton.addEventListener('click', () => show(index - 1));
  nextButton.addEventListener('click', () => show(index + 1));

  lightbox.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [closeButton, previousButton, nextButton].filter(button => !button.disabled);
    const current = controls.indexOf(document.activeElement);
    if (event.shiftKey && current === 0) {
      event.preventDefault();
      controls.at(-1).focus();
    } else if (!event.shiftKey && current === controls.length - 1) {
      event.preventDefault();
      controls[0].focus();
    }
  });

  document.addEventListener('keydown', event => {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') close();
    if (group.length > 1 && event.key === 'ArrowLeft') show(index - 1);
    if (group.length > 1 && event.key === 'ArrowRight') show(index + 1);
  });
})();
