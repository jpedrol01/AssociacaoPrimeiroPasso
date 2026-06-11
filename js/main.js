// Arquivo JS inicial — smooth scroll e validação simples de formulário
document.addEventListener('DOMContentLoaded', () => {
  console.log('Site da Associação carregado');

  // Smooth scroll para links internos
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', `#${targetId}`);
      }
    });
  });

  // Validação básica do formulário de contato
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const status = document.getElementById('formStatus');

      if (!name || !email || !message) {
        e.preventDefault();
        status.textContent = 'Por favor preencha todos os campos.';
        status.style.color = 'crimson';
        return;
      }
      // validação simples de email
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email)) {
        e.preventDefault();
        status.textContent = 'Informe um email válido.';
        status.style.color = 'crimson';
        return;
      }
      
      // Se passou na validação, deixa o formulário fazer o envio para Formspree
      status.textContent = 'Enviando...';
      status.style.color = '#445a7b';
    });
  }
});

// Carousel: autoplay, controls, indicators
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('mainCarousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const prev = carousel.querySelector('.carousel-control.prev');
  const next = carousel.querySelector('.carousel-control.next');
  const indicators = carousel.querySelector('.carousel-indicators');
  let current = 0;
  const total = slides.length;
  let intervalId = null;
  const delay = 4000;

  // create indicators
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    if (i === 0) btn.classList.add('active');
    btn.addEventListener('click', () => moveTo(i));
    indicators.appendChild(btn);
  });

  function update() {
    const offset = -current * carousel.offsetWidth;
    track.style.transform = `translateX(${offset}px)`;
    Array.from(indicators.children).forEach((b, i) => b.classList.toggle('active', i === current));
  }

  function moveTo(index) {
    current = (index + total) % total;
    update();
    resetInterval();
  }

  function prevSlide(){ moveTo(current - 1); }
  function nextSlide(){ moveTo(current + 1); }

  if (prev) prev.addEventListener('click', prevSlide);
  if (next) next.addEventListener('click', nextSlide);

  // autoplay
  function startInterval(){ intervalId = setInterval(nextSlide, delay); }
  function resetInterval(){ clearInterval(intervalId); startInterval(); }
  startInterval();

  // pause on hover/focus
  carousel.addEventListener('mouseenter', () => clearInterval(intervalId));
  carousel.addEventListener('mouseleave', () => startInterval());

  // handle resize
  window.addEventListener('resize', update);

  // touch support (basic)
  let startX = 0;
  carousel.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; clearInterval(intervalId); });
  carousel.addEventListener('touchend', (e) => {
    const dx = (e.changedTouches[0].clientX - startX);
    if (dx > 40) prevSlide();
    else if (dx < -40) nextSlide();
    startInterval();
  });

  // initial layout
  update();
});
