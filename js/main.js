/* ============================================================
   Atelier — logique du site
   Charge les données JSON puis construit galerie + fiches.
   ============================================================ */

const EURO = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
let OEUVRES = [];

document.addEventListener('DOMContentLoaded', init);

async function init() {
  setupNav();
  setupModal();
  setupForm();
  try {
    const [site, data] = await Promise.all([
      fetch('data/site.json').then(r => r.json()),
      fetch('data/oeuvres.json').then(r => r.json())
    ]);
    applySite(site);
    OEUVRES = data.oeuvres || [];
    renderGallery(OEUVRES);
  } catch (e) {
    console.error('Chargement des données impossible :', e);
    document.getElementById('gallery').innerHTML =
      '<p style="color:var(--gris)">Les œuvres n\'ont pas pu être chargées.</p>';
  }
}

/* ---- Remplissage des contenus texte (data-site="clé") ---- */
function applySite(site) {
  document.querySelectorAll('[data-site]').forEach(el => {
    const key = el.dataset.site;
    const val = site[key];
    if (val == null) return;

    if (key === 'hero_image' || key === 'a_propos_image') return; // gérés plus bas
    if (el.tagName === 'A' && key === 'email_contact') {
      el.textContent = val; el.href = 'mailto:' + val; return;
    }
    // Texte multi-paragraphes -> <p>
    if (typeof val === 'string' && val.includes('\n')) {
      el.innerHTML = val.split('\n').filter(Boolean).map(p => `<p>${escapeHtml(p)}</p>`).join('');
    } else {
      el.textContent = val;
    }
  });

  const hero = document.getElementById('heroImg');
  if (hero && site.hero_image) { hero.src = site.hero_image; hero.alt = site.hero_titre || ''; }
  const about = document.getElementById('aboutImg');
  if (about && site.a_propos_image) { about.src = site.a_propos_image; about.alt = site.a_propos_titre || ''; }

  document.title = `${site.nom_artiste} — Peintures originales`;
}

/* ---- Galerie ---- */
function renderGallery(oeuvres) {
  const grid = document.getElementById('gallery');
  grid.innerHTML = '';
  oeuvres.forEach((o, i) => {
    const vendu = o.statut === 'vendu';
    const btn = document.createElement('button');
    btn.className = 'card';
    btn.type = 'button';
    btn.setAttribute('aria-label', `Voir ${o.titre}`);
    btn.innerHTML = `
      <div class="card__media">
        <span class="card__tag ${vendu ? 'is-vendu' : ''}">${vendu ? 'Vendu' : 'Disponible'}</span>
        <img src="${o.images[0]}" alt="${escapeHtml(o.titre)}" loading="lazy" />
      </div>
      <div class="card__body">
        <h3 class="card__titre">${escapeHtml(o.titre)}</h3>
        <p class="card__sub">${o.largeur_cm} × ${o.hauteur_cm} cm · ${o.annee}</p>
        <p class="card__prix">${vendu ? '—' : EURO.format(o.prix)}</p>
      </div>`;
    btn.addEventListener('click', () => openModal(i));
    grid.appendChild(btn);
  });
}

/* ---- Modale / fiche œuvre ---- */
let currentImgs = [];
function setupModal() {
  const modal = document.getElementById('modal');
  modal.querySelectorAll('[data-close]').forEach(el =>
    el.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal(index) {
  const o = OEUVRES[index];
  const vendu = o.statut === 'vendu';
  document.getElementById('modalTitre').textContent = o.titre;
  document.getElementById('modalAnnee').textContent = o.annee;
  document.getElementById('modalTechnique').textContent = o.technique;
  document.getElementById('modalDimensions').textContent = `${o.largeur_cm} × ${o.hauteur_cm} cm`;
  const statut = document.getElementById('modalStatut');
  statut.textContent = vendu ? 'Vendu' : 'Disponible';
  statut.className = vendu ? 'is-vendu' : 'is-disponible';
  document.getElementById('modalPrix').textContent = vendu ? '—' : EURO.format(o.prix);
  document.getElementById('modalDescription').textContent = o.description || '';

  // Pré-remplit le formulaire de contact avec l'œuvre concernée
  document.getElementById('formOeuvre').value = o.titre;
  const cta = document.getElementById('modalContact');
  cta.addEventListener('click', () => {
    document.getElementById('sujet').value = `Demande — « ${o.titre} »`;
  }, { once: true });

  currentImgs = o.images;
  setMainImage(0);
  const thumbs = document.getElementById('modalThumbs');
  thumbs.innerHTML = '';
  o.images.forEach((src, i) => {
    const t = document.createElement('img');
    t.src = src; t.alt = `${o.titre} — vue ${i + 1}`;
    t.className = i === 0 ? 'is-active' : '';
    t.addEventListener('click', () => setMainImage(i));
    thumbs.appendChild(t);
  });

  const modal = document.getElementById('modal');
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function setMainImage(i) {
  document.getElementById('modalMain').src = currentImgs[i];
  document.querySelectorAll('#modalThumbs img').forEach((t, k) =>
    t.classList.toggle('is-active', k === i));
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ---- Navigation ---- */
function setupNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
}

/* ---- Formulaire ---- */
function setupForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  // En local (file:// ou hors Netlify) on évite l'erreur de POST et on affiche un message.
  form.addEventListener('submit', e => {
    const isNetlify = location.hostname.endsWith('netlify.app') || form.dataset.live === 'true';
    if (!isNetlify) {
      e.preventDefault();
      document.getElementById('formNote').hidden = false;
      document.getElementById('formNote').textContent =
        'Aperçu local : le formulaire sera fonctionnel une fois le site mis en ligne (voir README).';
    }
  });
}

/* ---- Util ---- */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
