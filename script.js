
const DATA = window.PORTFOLIO_DATA || { landscape: [], categories: [] };
const $ = (s, r=document) => r.querySelector(s);
const sections = $('#sections');
const allImages = [];

function setLinks(){
  $('#linkedinLink').href = DATA.links.linkedin;
  $('#artstationLink').href = DATA.links.artstation;
  $('#instagramLink').href = DATA.links.instagram;
  $('.email-label').textContent = DATA.email || '';
  if(DATA.aboutImage) $('#aboutImage').src = DATA.aboutImage;
}

function buildSections(){
  DATA.categories.forEach((cat, idx) => {
    const section = document.createElement('section');
    section.className = 'category';
    section.id = cat.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const count = String(idx + 1).padStart(2, '0');
    section.innerHTML = `<div class="section-head"><div><p class="section-index">${count}</p><h2>${cat.title}</h2></div></div><div class="gallery"></div>`;
    const gallery = $('.gallery', section);
    cat.items.forEach(item => {
      const globalIndex = allImages.length;
      allImages.push({ src: item.src, category: cat.title });
      const tile = document.createElement('button');
      tile.className = 'tile';
      tile.type = 'button';
      tile.innerHTML = `<img src="${item.src}" loading="lazy" alt="${cat.title}">`;
      tile.addEventListener('click', () => openLightbox(globalIndex));
      gallery.appendChild(tile);
    });
    sections.appendChild(section);
  });
}

function initHero(){
  const imgs = DATA.landscape || [];
  const a = $('#heroBgA'), b = $('#heroBgB');
  if (!imgs.length) return;
  let current = 0, showingA = true;
  a.style.backgroundImage = `url("${imgs[0]}")`;
  a.classList.add('is-visible');
  const swap = () => {
    current = (current + 1) % imgs.length;
    const visible = showingA ? a : b;
    const hidden = showingA ? b : a;
    hidden.style.backgroundImage = `url("${imgs[current]}")`;
    hidden.classList.remove('is-hidden');
    hidden.classList.add('is-visible');
    visible.classList.remove('is-visible');
    visible.classList.add('is-hidden');
    showingA = !showingA;
  };
  if (imgs.length > 1) setInterval(swap, 5000);
}

let lbIndex = 0;
function openLightbox(i){
  lbIndex = i;
  $('#lightboxImage').src = allImages[lbIndex].src;
  $('#lightbox').classList.add('open');
  $('#lightbox').setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
}
function closeLightbox(){
  $('#lightbox').classList.remove('open');
  $('#lightbox').setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}
function moveLightbox(step){
  if(!allImages.length) return;
  lbIndex = (lbIndex + step + allImages.length) % allImages.length;
  $('#lightboxImage').src = allImages[lbIndex].src;
}

function openAbout(){
  $('#aboutPanel').classList.add('open');
  $('#aboutPanel').setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
}
function closeAbout(){
  $('#aboutPanel').classList.remove('open');
  $('#aboutPanel').setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}

function bindUI(){
  $('#aboutBtn').addEventListener('click', openAbout);
  $('#heroAboutBtn').addEventListener('click', openAbout);
  $('#aboutClose').addEventListener('click', closeAbout);
  $('#aboutPanel').addEventListener('click', e => { if(e.target.id === 'aboutPanel') closeAbout(); });
  $('#lightboxClose').addEventListener('click', closeLightbox);
  $('#lightboxImage').addEventListener('click', closeLightbox);
  $('#lightbox').addEventListener('click', e => { if(e.target.id === 'lightbox') closeLightbox(); });
  $('#prevBtn').addEventListener('click', e => { e.stopPropagation(); moveLightbox(-1); });
  $('#nextBtn').addEventListener('click', e => { e.stopPropagation(); moveLightbox(1); });
  window.addEventListener('keydown', e => {
    if(e.key === 'Escape'){ closeLightbox(); closeAbout(); }
    if($('#lightbox').classList.contains('open') && e.key === 'ArrowLeft') moveLightbox(-1);
    if($('#lightbox').classList.contains('open') && e.key === 'ArrowRight') moveLightbox(1);
  });
  window.addEventListener('wheel', () => { if($('#lightbox').classList.contains('open')) closeLightbox(); if($('#aboutPanel').classList.contains('open')) closeAbout(); }, {passive:true});
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    $('#progress').style.width = `${(scrollY / max) * 100}%`;
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.dataset.parallax || 0);
      el.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
    });
  }, {passive:true});
}

function reveal(){
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('inview'); });
  }, {threshold:.14});
  document.querySelectorAll('.tile').forEach(el => obs.observe(el));
}

setLinks();
buildSections();
initHero();
bindUI();
reveal();
