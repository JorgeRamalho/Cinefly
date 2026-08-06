/* Cinefly — Interações da interface */
const CineflyUI = (() => {
  function toast(message, duration = 2800) {
    let wrap = document.querySelector('.toast-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'toast-wrap';
      document.body.appendChild(wrap);
    }
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    wrap.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.3s';
      setTimeout(() => el.remove(), 300);
    }, duration);
  }

  function typeLabel(type) {
    const map = { filme: 'Filme', série: 'Série', documentário: 'Doc' };
    return map[type] || type;
  }

  const FALLBACK_POSTER =
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop';
  const FALLBACK_BACKDROP =
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1400&q=80';

  function bindImageFallback(img, fallbackUrl) {
    if (!img) return;
    img.addEventListener('error', () => {
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = '1';
      img.src = fallbackUrl;
    });
  }

  function createPoster(item, options = {}) {
    const { ranked = false, wide = false } = options;
    const fav = CineflyAuth.isFavorite(item.id);
    const article = document.createElement('article');
    article.className = 'poster' + (wide ? ' wide' : '');
    article.dataset.id = item.id;
    article.innerHTML = `
      <div class="poster-img">
        ${ranked && item.rank ? `<span class="poster-rank">${item.rank}</span>` : ''}
        <span class="poster-type">${typeLabel(item.type)}</span>
        <img src="${item.poster}" alt="${item.title}" loading="lazy" />
        <div class="poster-overlay">
          <button class="btn-icon btn-play" title="Assistir" aria-label="Assistir">▶</button>
          <button class="btn-icon btn-fav ${fav ? 'active' : ''}" title="Favoritar" aria-label="Favoritar">${fav ? '♥' : '♡'}</button>
        </div>
      </div>
      <div class="poster-info">
        <h3>${item.title}</h3>
        <span>${item.year} · ★ ${item.rating}</span>
      </div>
    `;

    bindImageFallback(article.querySelector('img'), FALLBACK_POSTER);

    article.querySelector('.poster-img').addEventListener('click', (e) => {
      if (e.target.closest('.btn-fav') || e.target.closest('.btn-play')) return;
      openModal(item);
    });
    article.querySelector('.btn-play').addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(item);
    });
    article.querySelector('.btn-fav').addEventListener('click', (e) => {
      e.stopPropagation();
      handleFavorite(item.id, e.currentTarget);
    });

    return article;
  }

  function handleFavorite(id, btn) {
    if (!CineflyAuth.isLoggedIn()) {
      toast('Faça login para salvar favoritos ❤️');
      setTimeout(() => (window.location.href = 'login.html'), 900);
      return;
    }
    const result = CineflyAuth.toggleFavorite(id);
    if (result.ok) {
      btn.classList.toggle('active', result.added);
      btn.textContent = result.added ? '♥' : '♡';
      toast(result.added ? 'Adicionado aos favoritos ⭐' : 'Removido dos favoritos');
      document.dispatchEvent(new CustomEvent('cinefly:favorites', { detail: result }));
    }
  }

  function renderRail(container, items, options = {}) {
    if (!container) return;
    container.innerHTML = '';
    items.forEach((item, i) => {
      const poster = createPoster(item, options);
      poster.style.animationDelay = `${i * 0.05}s`;
      container.appendChild(poster);
    });
  }

  function initRailSlider(root) {
    if (!root) return;
    const track = root.querySelector('.rail');
    const prev = root.querySelector('.rail-prev');
    const next = root.querySelector('.rail-next');
    if (!track || !prev || !next) return;

    function step() {
      const card = track.querySelector('.poster');
      const gap = parseFloat(getComputedStyle(track).gap) || 14;
      return card ? card.offsetWidth + gap : Math.max(track.clientWidth * 0.8, 240);
    }

    function updateNav() {
      const max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    }

    prev.addEventListener('click', () => {
      track.scrollBy({ left: -step(), behavior: 'smooth' });
    });
    next.addEventListener('click', () => {
      track.scrollBy({ left: step(), behavior: 'smooth' });
    });
    track.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('resize', updateNav);
    requestAnimationFrame(updateNav);
  }

  function openModal(item) {
    let backdrop = document.getElementById('content-modal');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'content-modal';
      backdrop.className = 'modal-backdrop';
      backdrop.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true">
          <div class="modal-banner">
            <button class="modal-close" aria-label="Fechar">×</button>
            <img alt="" />
          </div>
          <div class="modal-body">
            <h2></h2>
            <div class="modal-meta"></div>
            <p></p>
            <div class="modal-actions"></div>
          </div>
        </div>
      `;
      document.body.appendChild(backdrop);
      backdrop.querySelector('.modal-close').addEventListener('click', closeModal);
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }

    const fav = CineflyAuth.isFavorite(item.id);
    const bannerImg = backdrop.querySelector('.modal-banner img');
    bannerImg.src = item.backdrop || item.poster;
    bannerImg.alt = item.title;
    bindImageFallback(bannerImg, FALLBACK_BACKDROP);
    backdrop.querySelector('h2').textContent = item.title;
    backdrop.querySelector('.modal-meta').innerHTML = `
      <span class="rating">★ ${item.rating}</span>
      <span>${item.year}</span>
      <span>${item.duration}</span>
      <span>${typeLabel(item.type)}</span>
      <span>${item.genres.join(' · ')}</span>
    `;
    backdrop.querySelector('p').textContent = item.synopsis;
    const actions = backdrop.querySelector('.modal-actions');
    actions.innerHTML = `
      <button class="btn btn-primary btn-watch">▶ Assistir agora</button>
      <button class="btn btn-secondary btn-modal-fav">${fav ? '♥ Nos favoritos' : '♡ Favoritar'}</button>
    `;
    actions.querySelector('.btn-watch').addEventListener('click', () => {
      toast(`Reproduzindo “${item.title}”… 🍿`);
    });
    actions.querySelector('.btn-modal-fav').addEventListener('click', (e) => {
      handleFavorite(item.id, e.currentTarget);
      const nowFav = CineflyAuth.isFavorite(item.id);
      e.currentTarget.textContent = nowFav ? '♥ Nos favoritos' : '♡ Favoritar';
    });

    requestAnimationFrame(() => backdrop.classList.add('open'));
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const backdrop = document.getElementById('content-modal');
    if (!backdrop) return;
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function initNavbar() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;

    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });

    const toggle = document.querySelector('.menu-toggle');
    const links = document.querySelector('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const open = links.classList.toggle('mobile-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      });
    }

    const user = CineflyAuth.getCurrentUser();
    const authSlot = document.getElementById('nav-auth');
    if (authSlot) {
      if (user) {
        authSlot.innerHTML = `
          <a href="favoritos.html" class="btn-icon" title="Favoritos" aria-label="Favoritos">♥</a>
          <div class="nav-avatar-wrap">
            <button class="avatar-btn" id="avatar-btn" aria-label="Menu do usuário">${
              user.avatar
                ? `<img src="${user.avatar}" alt="" />`
                : CineflyAuth.initials(user)
            }</button>
            <div class="user-menu" id="user-menu">
              <a href="perfil.html">👤 Meu perfil</a>
              <a href="favoritos.html">❤️ Favoritos</a>
              <button type="button" id="btn-logout">🚪 Sair</button>
            </div>
          </div>
        `;
        const avatarBtn = document.getElementById('avatar-btn');
        const menu = document.getElementById('user-menu');
        avatarBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          menu.classList.toggle('open');
        });
        document.addEventListener('click', () => menu.classList.remove('open'));
        document.getElementById('btn-logout').addEventListener('click', () => {
          CineflyAuth.logout();
          toast('Até logo! ✈️');
          setTimeout(() => (window.location.href = 'index.html'), 600);
        });
      } else {
        authSlot.innerHTML = `
          <a href="login.html" class="btn btn-ghost btn-sm">Entrar</a>
          <a href="cadastro.html" class="btn btn-primary btn-sm">Cadastrar</a>
        `;
      }
    }

    initSearch();
  }

  function initSearch() {
    const input = document.getElementById('search-input');
    const dropdown = document.getElementById('search-dropdown');
    if (!input || !dropdown) return;

    let timer;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const q = input.value;
        const results = searchCatalog(q).slice(0, 8);
        if (!q.trim() || results.length === 0) {
          dropdown.classList.remove('open');
          dropdown.innerHTML = q.trim()
            ? '<div class="search-item"><div class="meta"><strong>Nenhum resultado</strong><span>Tente outro termo</span></div></div>'
            : '';
          if (q.trim()) dropdown.classList.add('open');
          return;
        }
        dropdown.innerHTML = results
          .map(
            (item) => `
          <div class="search-item" data-id="${item.id}">
            <img src="${item.poster}" alt="" />
            <div class="meta">
              <strong>${item.title}</strong>
              <span>${typeLabel(item.type)} · ${item.year} · ★ ${item.rating}</span>
            </div>
          </div>
        `
          )
          .join('');
        dropdown.classList.add('open');
        dropdown.querySelectorAll('.search-item').forEach((el) => {
          el.addEventListener('click', () => {
            const item = getById(el.dataset.id);
            if (item) {
              openModal(item);
              dropdown.classList.remove('open');
              input.value = '';
            }
          });
        });
      }, 180);
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-search')) dropdown.classList.remove('open');
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') dropdown.classList.remove('open');
    });
  }

  function initSpotlightCarousel() {
    const root = document.getElementById('spotlight');
    const track = document.getElementById('spotlight-track');
    const dotsWrap = document.getElementById('spotlight-dots');
    const progressBar = document.getElementById('spotlight-progress-bar');
    if (!root || !track) return;

    const excluded = new Set(['m1']); // Horizonte Noturno fora do carrossel
    const mustInclude = ['m3']; // Velocidade Zero em destaque
    const trending = getTrending().filter((item) => !excluded.has(item.id));
    const extras = CINEFLY_CATALOG.filter(
      (item) => !item.trending && !excluded.has(item.id) && !mustInclude.includes(item.id)
    );
    const priority = mustInclude.map(getById).filter(Boolean);
    const slidesData = [
      ...priority,
      ...trending.filter((item) => !mustInclude.includes(item.id)),
      ...extras
    ].slice(0, 6);

    if (!slidesData.length) return;

    let index = 0;
    let timer = null;
    let progressTimer = null;
    let paused = false;
    const DURATION = 5500;

    track.innerHTML = slidesData
      .map(
        (item, i) => `
      <article class="spotlight-slide ${i === 0 ? 'active' : ''}" data-id="${item.id}" data-index="${i}" role="group" aria-roledescription="slide" aria-label="${i + 1} de ${slidesData.length}">
        <img src="${item.backdrop || item.poster}" alt="${item.title}" />
        <div class="spotlight-caption">
          <div class="container">
            <div class="spotlight-badge">
              <span class="pill">★ Destaque</span>
              <span>${typeLabel(item.type)}</span>
            </div>
            <p class="spotlight-title">${item.title}</p>
            <p class="legend">${item.synopsis}</p>
            <div class="spotlight-meta">
              <span class="rating">★ ${item.rating}</span>
              <span>${item.year}</span>
              <span>${item.duration}</span>
              <span class="type-tag">${item.genres.slice(0, 2).join(' · ')}</span>
            </div>
            <div class="spotlight-actions">
              <button class="btn btn-primary btn-spotlight-play" type="button">▶ Assistir</button>
              <button class="btn btn-secondary btn-spotlight-info" type="button">ℹ Detalhes</button>
            </div>
          </div>
        </div>
      </article>
    `
      )
      .join('');

    dotsWrap.innerHTML = slidesData
      .map(
        (_, i) =>
          `<button type="button" role="tab" aria-label="Ir para destaque ${i + 1}" class="${i === 0 ? 'active' : ''}" data-index="${i}"></button>`
      )
      .join('');

    track.querySelectorAll('.spotlight-slide img').forEach((img) => {
      bindImageFallback(img, FALLBACK_BACKDROP);
    });

    function goTo(next) {
      const slides = track.querySelectorAll('.spotlight-slide');
      const dots = dotsWrap.querySelectorAll('button');
      index = ((next % slides.length) + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('active', i === index));
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
      restartProgress();
    }

    function next() {
      goTo(index + 1);
    }

    function prev() {
      goTo(index - 1);
    }

    function clearTimers() {
      clearInterval(timer);
      clearInterval(progressTimer);
      timer = null;
      progressTimer = null;
    }

    function restartProgress() {
      if (!progressBar) return;
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      void progressBar.offsetWidth;
      if (paused) return;
      progressBar.style.transition = `width ${DURATION}ms linear`;
      progressBar.style.width = '100%';
    }

    function startAutoplay() {
      clearTimers();
      if (paused) return;
      restartProgress();
      timer = setInterval(next, DURATION);
    }

    function pause() {
      paused = true;
      clearTimers();
      if (progressBar) {
        const computed = getComputedStyle(progressBar).width;
        progressBar.style.transition = 'none';
        progressBar.style.width = computed;
      }
    }

    function resume() {
      paused = false;
      startAutoplay();
    }

    document.getElementById('spotlight-next')?.addEventListener('click', (e) => {
      e.stopPropagation();
      next();
      startAutoplay();
    });
    document.getElementById('spotlight-prev')?.addEventListener('click', (e) => {
      e.stopPropagation();
      prev();
      startAutoplay();
    });

    dotsWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-index]');
      if (!btn) return;
      goTo(Number(btn.dataset.index));
      startAutoplay();
    });

    track.addEventListener('click', (e) => {
      const slide = e.target.closest('.spotlight-slide');
      if (!slide) return;
      const item = getById(slide.dataset.id);
      if (!item) return;
      if (e.target.closest('.btn-spotlight-play') || e.target.closest('.btn-spotlight-info') || e.target.closest('.spotlight-actions')) {
        e.stopPropagation();
        openModal(item);
        return;
      }
      openModal(item);
    });

    root.addEventListener('mouseenter', pause);
    root.addEventListener('mouseleave', resume);
    root.addEventListener('focusin', pause);
    root.addEventListener('focusout', (e) => {
      if (!root.contains(e.relatedTarget)) resume();
    });

    let touchStartX = 0;
    root.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
        pause();
      },
      { passive: true }
    );
    root.addEventListener(
      'touchend',
      (e) => {
        const dx = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(dx) > 50) {
          if (dx < 0) next();
          else prev();
        }
        resume();
      },
      { passive: true }
    );

    document.addEventListener('keydown', (e) => {
      if (!root.matches(':hover') && document.activeElement !== document.body) return;
      if (e.key === 'ArrowRight') {
        next();
        startAutoplay();
      }
      if (e.key === 'ArrowLeft') {
        prev();
        startAutoplay();
      }
    });

    startAutoplay();
  }

  function initHome() {
    initSpotlightCarousel();

    renderRail(document.getElementById('rail-trending'), getTrending(), { ranked: true });
    renderRail(document.getElementById('rail-filmes'), getByType('filme'));
    renderRail(document.getElementById('rail-series'), getByType('série'));
    renderRail(document.getElementById('rail-docs'), getByType('documentário'));
    renderRail(document.getElementById('rail-continue'), CINEFLY_CATALOG.slice(3, 9), { wide: true });
    initRailSlider(document.querySelector('#continuar [data-rail-slider]'));

    const chips = document.getElementById('category-chips');
    if (chips) {
      chips.innerHTML = CATEGORIES.map(
        (c, i) =>
          `<button class="chip ${i === 0 ? 'active' : ''}" data-cat="${c.id}">${c.emoji} ${c.label}</button>`
      ).join('');
      chips.addEventListener('click', (e) => {
        const btn = e.target.closest('.chip');
        if (!btn) return;
        chips.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
        btn.classList.add('active');
        const filtered = filterCatalog(btn.dataset.cat);
        const grid = document.getElementById('catalog-grid');
        if (grid) {
          grid.innerHTML = '';
          filtered.forEach((item, i) => {
            const p = createPoster(item);
            p.style.animationDelay = `${i * 0.04}s`;
            grid.appendChild(p);
          });
        }
      });
      chips.querySelector('.chip')?.click();
    }
  }

  function initFavoritesPage() {
    if (!CineflyAuth.requireAuth()) return;
    const grid = document.getElementById('favorites-grid');
    const empty = document.getElementById('favorites-empty');
    function render() {
      const ids = CineflyAuth.getFavorites();
      const items = ids.map(getById).filter(Boolean);
      if (!items.length) {
        grid.innerHTML = '';
        empty.style.display = 'block';
        return;
      }
      empty.style.display = 'none';
      grid.innerHTML = '';
      items.forEach((item) => grid.appendChild(createPoster(item)));
    }
    render();
    document.addEventListener('cinefly:favorites', render);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  return {
    toast,
    initNavbar,
    initHome,
    initFavoritesPage,
    createPoster,
    renderRail,
    openModal,
    typeLabel
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  CineflyUI.initNavbar();
  if (document.body.dataset.page === 'home') CineflyUI.initHome();
  if (document.body.dataset.page === 'favoritos') CineflyUI.initFavoritesPage();
});
