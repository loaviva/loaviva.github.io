/* ════════════════════════════════════════════════════════
   LOA VIVA — interacciones PRO (scrollytelling + marketplace)
   ════════════════════════════════════════════════════════ */
(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const PEN = (n) => 'S/' + n.toFixed(2);

  /* ── 0. PRELOADER + hero entrance ── */
  const preloader = $('#preloader'), preBar = $('#preBar'), heroSection = $('.hero');
  let preDone = false;
  const finishPre = () => {
    if (preDone) return; preDone = true;
    if (preBar) preBar.style.width = '100%';
    setTimeout(() => {
      preloader?.classList.add('done');
      heroSection?.classList.add('hero-go');
      document.body.classList.add('loaded');
    }, 250);
  };
  if (reduceMotion || !preloader) {
    preloader?.classList.add('done');
    heroSection?.classList.add('hero-go');
  } else {
    let p = 0;
    const fake = setInterval(() => { p = Math.min(p + 10 + Math.random() * 16, 92); preBar.style.width = p + '%'; }, 110);
    const ready = () => { clearInterval(fake); finishPre(); };
    // Desacoplado de la imagen pesada: dismiss rápido tras parsear el DOM.
    // window.load llega antes si todo cargó; 900ms es el tope para no bloquear el LCP.
    window.addEventListener('load', ready, { once: true });
    setTimeout(ready, 900);
  }

  /* ── data ── */
  const PRODUCTS = [
    { id: 'hidrata', name: 'Loa Hidrata', color: 'var(--aqua)', desc: 'Tubo x10 · electrolitos + cítrico suave', price: 1.9, rating: 4.8, reviews: 612, photo: 'crop', pos: '1% 50%' },
    { id: 'activa', name: 'Loa Activa', color: 'var(--cit)', desc: 'Tubo x10 · magnesio + B, sabor tropical', price: 1.9, rating: 4.9, reviews: 845, photo: 'crop', pos: '50% 50%' },
    { id: 'defensas', name: 'Loa Defensas', color: 'var(--trop)', desc: 'Tubo x10 · vitamina C + zinc, berries', price: 1.9, rating: 4.7, reviews: 503, photo: 'crop', pos: '99% 50%' },
    { id: 'mix3', name: 'Pack Mix x3', color: 'var(--berry)', desc: 'Los 3 sabores en un solo pack', price: 4.9, old: 5.7, badge: 'Más vendido', badgeCls: '', rating: 4.9, reviews: 1290, photo: 'full' },
    { id: 'familiar6', name: 'Pack Familiar x6', color: 'var(--trop)', desc: '6 tubos para toda la casa', price: 9.9, old: 11.4, badge: 'Ahorra 15%', badgeCls: 'alt', rating: 4.8, reviews: 410, photo: 'full' },
    { id: 'sub', name: 'Suscripción', color: 'var(--aqua)', desc: 'x12 al mes · reorder automático', price: 16.9, old: 19.9, badge: 'Suscríbete', badgeCls: 'sub', rating: 5.0, reviews: 233, photo: 'hero' },
  ];
  const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

  const TESTIMONIALS = [
    { n: 'Diego R.', r: 'Miraflores · gym 3x/sem', img: 12, s: 5, t: 'Cambié la gaseosa del almuerzo por Loa Activa y rindo igual en el gym, sin el bajón de azúcar. No vuelvo atrás.' },
    { n: 'Sandra M.', r: 'San Miguel · mamá', img: 45, s: 5, t: 'Mis hijos por fin toman agua. La de berries les encanta y a mí me deja tranquila: cero azúcar.' },
    { n: 'Carla P.', r: 'San Isidro · oficina', img: 47, s: 5, t: 'La llevo en la mochila a la oficina. Una pastilla y adiós al café de las 4pm. Mi hidratación cambió por completo.' },
    { n: 'Andrés V.', r: 'Surco', img: 33, s: 4, t: 'Sabor real sin culpa. Increíble que cueste casi lo mismo que una gaseosa de bodega.' },
    { n: 'Lucía F.', r: 'Jesús María', img: 5, s: 5, t: 'La compro en la bodega de la esquina. Práctica, rica y sin azúcar. La recomiendo a todo el mundo.' },
    { n: 'Martín G.', r: 'La Molina · crossfit', img: 60, s: 5, t: 'Entreno cross y la Activa es mi pre-workout limpio. Cero cafeína, pura energía mía.' },
    { n: 'Valeria T.', r: 'Barranco · runner', img: 24, s: 5, t: 'Corro de noche y la Hidrata es mi ritual post-carrera. Electrolitos sin nada raro encima.' },
    { n: 'Bruno C.', r: 'Callao · ciclista', img: 53, s: 5, t: 'En ruta no hay botellas que valgan: una pastilla en cualquier caño de agua y listo. Genialidad pura.' },
  ];
  const stars = (n) => '★★★★★☆☆'.slice(5 - n, 10 - n);

  /* ── 1. Reveal (IO fallback siempre activo) ── */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach((r) => io.observe(r));
  } else { $$('.reveal').forEach((r) => r.classList.add('visible')); }

  /* ── 2. Nav + progress ── */
  const nav = $('#nav'), progress = $('#scrollProgress');
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 30);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ── 3. Mobile menu ── */
  const burger = $('#burger'), menu = $('#mobileMenu');
  if (burger && menu) {
    const tog = (open) => {
      const o = open ?? !menu.classList.contains('open');
      menu.classList.toggle('open', o); burger.classList.toggle('open', o);
      burger.setAttribute('aria-expanded', String(o)); document.body.style.overflow = o ? 'hidden' : '';
    };
    burger.addEventListener('click', () => tog());
    $$('a', menu).forEach((a) => a.addEventListener('click', () => tog(false)));
  }

  /* ── 4. Counters ── */
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || '', dur = 1400;
    let start = null; const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (ts) => { if (start === null) start = ts; const p = Math.min((ts - start) / dur, 1); el.textContent = Math.round(ease(p) * target) + suffix; if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { reduceMotion ? (e.target.textContent = e.target.dataset.count + (e.target.dataset.suffix || '')) : animateCount(e.target); cio.unobserve(e.target); } }), { threshold: 0.6 });
    $$('[data-count]').forEach((c) => cio.observe(c));
  }

  /* ── 5. Manifiesto: reveal palabra por palabra ── */
  const mani = $('#manifestoText');
  if (mani) {
    const frag = document.createDocumentFragment();
    mani.childNodes.forEach((node) => {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach((tk) => {
          if (/^\s+$/.test(tk) || tk === '') { frag.appendChild(document.createTextNode(tk)); }
          else { const s = document.createElement('span'); s.className = 'w'; s.textContent = tk; frag.appendChild(s); }
        });
      } else if (node.nodeType === 1) {
        const em = document.createElement(node.tagName.toLowerCase());
        node.textContent.split(/(\s+)/).forEach((tk) => {
          if (/^\s+$/.test(tk) || tk === '') { em.appendChild(document.createTextNode(tk)); }
          else { const s = document.createElement('span'); s.className = 'w'; s.textContent = tk; em.appendChild(s); }
        });
        frag.appendChild(em);
      }
    });
    mani.textContent = ''; mani.appendChild(frag);
    const words = $$('.w', mani);
    if (reduceMotion) { words.forEach((w) => w.classList.add('on')); }
    else {
      const update = () => {
        const r = mani.getBoundingClientRect();
        const vh = window.innerHeight;
        const prog = Math.min(Math.max((vh * 0.82 - r.top) / (r.height + vh * 0.25), 0), 1);
        const upto = Math.floor(prog * words.length);
        words.forEach((w, i) => w.classList.toggle('on', i <= upto));
      };
      window.addEventListener('scroll', update, { passive: true }); update();
    }
  }

  /* ── 6. Parallax (GSAP si carga; fallback rAF) ── */
  const initMotion = () => {
    if (reduceMotion) return;
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.to('#heroPhoto', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('#racingBg', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.racing', start: 'top bottom', end: 'bottom top', scrub: true } });
      $$('.racing-card').forEach((card, i) => {
        gsap.from(card, { y: 60, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 88%' }, delay: i * .06 });
      });
      gsap.from('.cta-quote', { scale: .92, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.cta', start: 'top 70%' } });
    } else {
      // fallback: parallax suave con rAF
      const hp = $('#heroPhoto'), rb = $('#racingBg');
      let tick = false;
      const run = () => {
        if (hp) { const t = Math.min(window.scrollY / window.innerHeight, 1.2); hp.style.transform = `translateY(${t * 60}px)`; }
        if (rb) { const r = rb.getBoundingClientRect(); rb.style.transform = `translateY(${(r.top / window.innerHeight) * -40}px)`; }
        tick = false;
      };
      window.addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(run); } }, { passive: true });
    }
  };
  // GSAP llega con defer: espera al load
  if (document.readyState === 'complete') initMotion();
  else window.addEventListener('load', initMotion, { once: true });

  /* ── 7. Flavor switcher ── */
  const tabs = $$('.flavor-tab'), panels = $$('.flavor-panel');
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    const f = tab.dataset.flavor;
    tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
    panels.forEach((p) => p.classList.toggle('is-active', p.dataset.flavor === f));
  }));

  /* ── 8. Magnetic ── */
  if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
    $$('.magnetic').forEach((b) => {
      b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.28}px)`; });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }

  /* ── 9. Forms (demo) ── */
  const b2b = $('#b2bForm');
  if (b2b) b2b.addEventListener('submit', (e) => { e.preventDefault(); if (!b2b.checkValidity()) return b2b.reportValidity(); $('#b2bNote').hidden = false; b2b.querySelectorAll('input,select').forEach((f) => (f.value = '')); });

  /* ── 10. Partículas hero ── */
  const canvas = $('#fxCanvas');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    const colors = ['255,158,27', '25,224,140', '255,46,116', '42,157,255'];
    let parts = [], w = 0, h = 0, raf = null;
    const make = (b) => { const r = 1.5 + Math.random() * 7; return { x: Math.random() * w, y: b ? h + r : Math.random() * h, r, sp: .2 + Math.random() * .8 + r * .04, dr: (Math.random() - .5) * .4, wo: Math.random() * 6.28, a: .08 + Math.random() * .3, c: colors[(Math.random() * 4) | 0] }; };
    const init = () => { const dpr = Math.min(devicePixelRatio || 1, 2), p = canvas.parentElement; w = p.clientWidth; h = p.clientHeight; canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = w + 'px'; canvas.style.height = h + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); parts = Array.from({ length: Math.min(50, (w / 28) | 0) }, () => make(false)); };
    const draw = () => { ctx.clearRect(0, 0, w, h); for (const b of parts) { b.y -= b.sp; b.wo += .02; b.x += b.dr + Math.sin(b.wo) * .3; if (b.y + b.r < 0) Object.assign(b, make(true)); ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.29); ctx.fillStyle = `rgba(${b.c},${b.a * .5})`; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = `rgba(${b.c},${b.a})`; ctx.stroke(); } raf = requestAnimationFrame(draw); };
    init(); draw();
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(init, 180); });
    if ('IntersectionObserver' in window) new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { if (!raf) draw(); } else { cancelAnimationFrame(raf); raf = null; } }), { threshold: 0 }).observe(canvas.parentElement);
  }

  /* ── 11. TIENDA ── */
  const shop = $('#shopGrid');
  if (shop) {
    shop.innerHTML = PRODUCTS.map((p) => {
      let photo;
      if (p.photo === 'crop') photo = `<div class="shop-photo crop" style="background-position:${p.pos}"></div>`;
      else if (p.photo === 'hero') photo = `<div class="shop-photo full" style="background-image:url('assets/loa-hero-hidrata.jpg');background-position:center 35%"></div>`;
      else photo = `<div class="shop-photo full"></div>`;
      const badge = p.badge ? `<span class="shop-badge ${p.badgeCls}">${p.badge}</span>` : '';
      const price = `<div class="shop-price"><b>${PEN(p.price)}</b>${p.old ? `<s>${PEN(p.old)}</s>` : ''}</div>`;
      return `<article class="shop-card reveal" style="--c:${p.color}">${badge}
        <div class="shop-visual">${photo}</div>
        <h3 class="shop-name">${p.name}</h3>
        <p class="shop-desc">${p.desc}</p>
        <div class="shop-rating"><span class="shop-stars">${stars(Math.round(p.rating))}</span> ${p.rating.toFixed(1)} · ${p.reviews} reseñas</div>
        <div class="shop-foot">${price}<button class="shop-add" data-add="${p.id}">Agregar
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></button></div>
      </article>`;
    }).join('');
    if ('IntersectionObserver' in window) { const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), { threshold: .12 }); $$('.shop-card', shop).forEach((c) => io.observe(c)); }
    shop.addEventListener('click', (e) => { const b = e.target.closest('[data-add]'); if (b) addToCart(b.dataset.add); });
  }
  $$('.add-from-flavor').forEach((b) => b.addEventListener('click', () => addToCart(b.dataset.id)));

  /* ── 12. CARRITO ── */
  const cart = {};
  const elDrawer = $('#cartDrawer'), elOverlay = $('#cartOverlay'), elItems = $('#cartItems'),
    elTotal = $('#cartTotal'), elCount = $('#cartCount'), elNote = $('#cartNote'), toast = $('#toast');
  let toastT;
  const showToast = (m) => { if (!toast) return; toast.textContent = m; toast.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('show'), 1800); };
  const openCart = (o) => { const open = o ?? !elDrawer.classList.contains('open'); elDrawer.classList.toggle('open', open); elOverlay.classList.toggle('open', open); };
  function addToCart(id) { cart[id] = (cart[id] || 0) + 1; if (elNote) elNote.hidden = true; renderCart(); showToast('Agregado al carrito ✓'); }
  const renderCart = () => {
    const ids = Object.keys(cart);
    const count = ids.reduce((s, id) => s + cart[id], 0);
    const total = ids.reduce((s, id) => s + cart[id] * byId[id].price, 0);
    if (elCount) { elCount.textContent = count; elCount.classList.toggle('show', count > 0); }
    if (elTotal) elTotal.textContent = PEN(total);
    if (!elItems) return;
    elItems.innerHTML = ids.length
      ? ids.map((id) => { const p = byId[id]; return `<div class="cart-item" style="--c:${p.color}">
          <div class="cart-thumb">${p.photo === 'crop' ? '🧪' : '📦'}</div>
          <div class="cart-item-info"><strong>${p.name}</strong><span>${PEN(p.price)} c/u</span>
            <div class="qty"><button data-q="-1" data-id="${id}">−</button><b>${cart[id]}</b><button data-q="1" data-id="${id}">+</button>
            <button class="cart-rm" data-rm="${id}">Quitar</button></div></div>
          <strong>${PEN(p.price * cart[id])}</strong></div>`; }).join('')
      : '<p class="cart-empty">Tu carrito está vacío.<br>¡Despierta tu agua! 💧</p>';
  };
  if (elItems) elItems.addEventListener('click', (e) => {
    const q = e.target.closest('[data-q]'); const rm = e.target.closest('[data-rm]');
    if (q) { const id = q.dataset.id; cart[id] = (cart[id] || 0) + parseInt(q.dataset.q, 10); if (cart[id] <= 0) delete cart[id]; renderCart(); }
    if (rm) { delete cart[rm.dataset.rm]; renderCart(); }
  });
  $('#cartBtn')?.addEventListener('click', () => openCart(true));
  $('#cartClose')?.addEventListener('click', () => openCart(false));
  elOverlay?.addEventListener('click', () => openCart(false));
  $('#checkoutBtn')?.addEventListener('click', () => {
    if (!Object.keys(cart).length) return showToast('Tu carrito está vacío');
    Object.keys(cart).forEach((k) => delete cart[k]); renderCart();
    if (elNote) elNote.hidden = false;
  });
  renderCart();

  /* ── 13. TESTIMONIOS ── */
  const tm = $('#tmTrack');
  if (tm) {
    const card = (x) => `<div class="tcard"><div class="tcard-stars">${stars(x.s)}</div><p class="tcard-text">"${x.t}"</p>
      <div class="tcard-user"><img src="https://i.pravatar.cc/80?img=${x.img}" alt="" loading="lazy" /><div><strong>${x.n}</strong><span>${x.r}</span></div></div></div>`;
    tm.innerHTML = (TESTIMONIALS.map(card).join('')).repeat(2);
  }

  /* ── 14. Smooth anchors ── */
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const el = $(id); if (!el) return; e.preventDefault();
    scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: reduceMotion ? 'auto' : 'smooth' });
  }));
})();
