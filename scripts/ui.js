// Manejo del menú móvil y scroll suave
document.addEventListener('DOMContentLoaded', ()=>{
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if(toggle && links){
    toggle.addEventListener('click', ()=>{
      links.classList.toggle('show');
    });
    // cerrar al click en link (móvil)
    links.addEventListener('click', (e)=>{
      if(e.target.tagName === 'A') links.classList.remove('show');
    });
  }

  // scroll suave para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href.length > 1){
        const el = document.querySelector(href);
        if(el){
          e.preventDefault();
          el.scrollIntoView({behavior:'smooth',block:'start'});
        }
      }
    });
  });

  // highlight active section in nav
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navItems = Array.from(document.querySelectorAll('.nav-links a'));
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const id = entry.target.id;
        navItems.forEach(a=> a.classList.toggle('active', a.getAttribute('href') === '#'+id));
      }
    });
  },{threshold:0.5});
  sections.forEach(s=>observer.observe(s));

  // Typing effect in hero (simple)
  const typed = document.querySelector('.typed');
  if(typed){
    const words = JSON.parse(typed.getAttribute('data-words') || '[]');
    let wi = 0, ci = 0, adding = true;
    const speed = 60;
    function tick(){
      const word = words[wi] || '';
      if(adding){
        typed.textContent = word.slice(0, ci+1);
        ci++;
        if(ci >= word.length){ adding = false; setTimeout(tick, 900); return; }
      } else {
        typed.textContent = word.slice(0, ci-1);
        ci--;
        if(ci <= 0){ adding = true; wi = (wi+1) % words.length; setTimeout(tick, 300); return; }
      }
      setTimeout(tick, speed);
    }
    if(words.length) tick();
  }

  // Reveal elements on scroll
  const revealEls = document.querySelectorAll('.reveal, .card, .skills .skill, .panel');
  const rObs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('show'); });
  },{threshold:0.12});
  revealEls.forEach(el=>rObs.observe(el));

  // Visor con zoom para imagenes del negocio
  const lightbox = document.querySelector('#imageLightbox');
  const lightboxImage = lightbox?.querySelector('.lightbox-image');
  let imageZoom = 1;

  function setLightboxZoom(value){
    imageZoom = Math.min(3, Math.max(1, value));
    if(lightboxImage) lightboxImage.style.setProperty('--zoom', imageZoom.toFixed(2));
  }

  function closeLightbox(){
    if(!lightbox || !lightboxImage) return;
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.removeAttribute('src');
    lightboxImage.alt = '';
    setLightboxZoom(1);
  }

  document.querySelectorAll('.card-media').forEach(img=>{
    img.addEventListener('click', ()=>{
      if(!lightbox || !lightboxImage) return;
      lightboxImage.src = img.currentSrc || img.src;
      lightboxImage.alt = img.alt || 'Imagen ampliada';
      lightbox.classList.add('show');
      lightbox.setAttribute('aria-hidden', 'false');
      setLightboxZoom(1);
    });
  });

  lightbox?.addEventListener('click', (e)=>{
    if(e.target === lightbox || e.target.closest('[data-lightbox-close]')) closeLightbox();

    const zoomAction = e.target.closest('[data-lightbox-zoom]')?.dataset.lightboxZoom;
    if(zoomAction === 'in') setLightboxZoom(imageZoom + 0.25);
    if(zoomAction === 'out') setLightboxZoom(imageZoom - 0.25);
    if(zoomAction === 'reset') setLightboxZoom(1);
  });

  lightbox?.addEventListener('wheel', (e)=>{
    e.preventDefault();
    setLightboxZoom(imageZoom + (e.deltaY < 0 ? 0.15 : -0.15));
  }, {passive:false});

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeLightbox();
  });
});
