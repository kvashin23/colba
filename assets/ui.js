// Общие элементы интерфейса: шапка страницы, карусели, просмотр фото/видео, модальные окна,
// онлайн-запись и формы-заявки. Подключается на всех страницах после layout.js.
const UI = (() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const e = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const UP = 'https://colbacolorbar.ru/storage/app/uploads/public/';
  const img = p => (/^https?:/.test(p) ? p : UP + p);
  const rub = n => (n == null ? '' : Number(n).toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽');
  const param = k => new URLSearchParams(location.search).get(k);

  // ---------- Разметка ----------
  const crumbs = items => `
    <nav class="crumbs" aria-label="Хлебные крошки">
      <a class="crumbs__back" href="javascript:history.back()">‹ Назад</a>
      <span><a href="index.html">Главная</a></span>
      ${items.map(([t, h]) => `<span>${h ? `<a href="${h}">${e(t)}</a>` : e(t)}</span>`).join('')}
    </nav>`;

  // Шапка внутренней страницы — как на странице команды
  const head = ({ title, lead = '', crumbs: c = [], extra = '', small = false }) => `
    ${crumbs(c)}
    <section class="page-head${small ? ' page-head--small' : ''}">
      <h1 class="h-display">${title}</h1>
      ${lead ? `<p class="page-head__lead">${lead}</p>` : ''}
      ${extra}
    </section>`;

  const arrows = id => `
    <div class="arrows" data-for="${id}">
      <button type="button" data-dir="-1" aria-label="Назад"><svg width="10" height="14" viewBox="0 0 10 14"><path d="M8 1L2 7l6 6" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
      <button type="button" data-dir="1" aria-label="Вперёд"><svg width="10" height="14" viewBox="0 0 10 14"><path d="M2 1l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
    </div>`;

  function initRails(root = document) {
    $$('.arrows', root).forEach(ctrl => {
      if (ctrl.dataset.ready) return; ctrl.dataset.ready = 1;
      const rail = document.getElementById(ctrl.dataset.for); if (!rail) return;
      const [prev, next] = $$('button', ctrl);
      const sync = () => {
        prev.disabled = rail.scrollLeft <= 2;
        next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
        ctrl.hidden = rail.scrollWidth <= rail.clientWidth + 2;
      };
      ctrl.addEventListener('click', ev => {
        const b = ev.target.closest('button'); if (!b) return;
        rail.scrollBy({ left: b.dataset.dir * rail.clientWidth * 0.8, behavior: 'smooth' });
      });
      rail.addEventListener('scroll', sync, { passive: true });
      addEventListener('resize', sync); addEventListener('load', sync); sync();
    });
  }

  // Табы-«таблетки»: [{v, l, n}] -> html; onChange(v)
  function tabs(el, list, current, onChange) {
    el.classList.add('filters');
    el.innerHTML = list.map(t => `<button type="button" data-v="${e(t.v)}" aria-pressed="${t.v === current}">${e(t.l)}${t.n != null ? ` <small>${t.n}</small>` : ''}</button>`).join('');
    el.onclick = ev => {
      const b = ev.target.closest('button'); if (!b) return;
      $$('button', el).forEach(x => x.setAttribute('aria-pressed', x === b));
      onChange(b.dataset.v);
    };
  }

  // ---------- Модальное окно ----------
  function modal(html, { cls = '', onClose } = {}) {
    const wrap = document.createElement('div');
    wrap.className = 'modal';
    wrap.innerHTML = `<div class="modal__backdrop" data-close></div>
      <div class="modal__box ${cls}" role="dialog" aria-modal="true">
        <button class="modal__close" type="button" aria-label="Закрыть" data-close>×</button>
        <div class="modal__body">${html}</div>
      </div>`;
    const prevFocus = document.activeElement;
    const close = () => {
      wrap.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      removeEventListener('keydown', onKey);
      setTimeout(() => wrap.remove(), 250);
      prevFocus?.focus?.();
      onClose?.();
    };
    const onKey = ev => { if (ev.key === 'Escape') close(); };
    wrap.addEventListener('click', ev => { if (ev.target.closest('[data-close]')) close(); });
    addEventListener('keydown', onKey);
    document.body.append(wrap);
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => { wrap.classList.add('is-open'); $('.modal__close', wrap).focus(); });
    return { el: wrap, body: $('.modal__body', wrap), close };
  }

  // ---------- Просмотр фото и видео ----------
  // <a data-lightbox="группа" href="фото"> или <a data-video="youtubeId">
  function lightbox(items, start) {
    let i = start;
    const m = modal('<div class="lb"><div class="lb__stage"></div><button class="lb__nav lb__prev" type="button" aria-label="Предыдущее">‹</button><button class="lb__nav lb__next" type="button" aria-label="Следующее">›</button><div class="lb__count"></div></div>', { cls: 'modal__box--media' });
    const stage = $('.lb__stage', m.el);
    const show = () => {
      const it = items[i];
      stage.innerHTML = it.video
        ? `<iframe src="https://www.youtube.com/embed/${e(it.video)}?autoplay=1&rel=0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen title="Видео"></iframe>`
        : `<img src="${e(it.src)}" alt="">`;
      $('.lb__count', m.el).textContent = items.length > 1 ? `${i + 1} / ${items.length}` : '';
      $$('.lb__nav', m.el).forEach(b => (b.hidden = items.length < 2));
    };
    $('.lb__prev', m.el).onclick = () => { i = (i - 1 + items.length) % items.length; show(); };
    $('.lb__next', m.el).onclick = () => { i = (i + 1) % items.length; show(); };
    const key = ev => { if (ev.key === 'ArrowLeft') $('.lb__prev', m.el).click(); if (ev.key === 'ArrowRight') $('.lb__next', m.el).click(); };
    addEventListener('keydown', key);
    m.el.addEventListener('click', ev => { if (ev.target.closest('[data-close]')) removeEventListener('keydown', key); });
    show();
  }
  document.addEventListener('click', ev => {
    const a = ev.target.closest('a[data-lightbox], a[data-video]'); if (!a) return;
    ev.preventDefault();
    if (a.dataset.video) {
      const group = a.dataset.group ? $$(`a[data-video][data-group="${a.dataset.group}"]`) : [a];
      return lightbox(group.map(x => ({ video: x.dataset.video })), group.indexOf(a));
    }
    const group = $$(`a[data-lightbox="${a.dataset.lightbox}"]`).filter(x => x.offsetParent);
    lightbox(group.map(x => ({ src: x.href })), Math.max(0, group.indexOf(a)));
  });

  // Видео, которых больше нет на YouTube, отдают заглушку 120×90 — прячем плитку, а пустой блок целиком
  const dropDeadVideo = ev => {
    const i = ev.target;
    if (i.tagName !== 'IMG' || !i.closest('.video-tile') || (ev.type === 'load' && i.naturalWidth > 120)) return;
    const grid = i.closest('.photo-grid');
    i.closest('.video-tile').remove();
    if (grid && !grid.querySelector('.video-tile')) (grid.closest('[data-video-block]') || grid).remove();
  };
  document.addEventListener('load', dropDeadVideo, true);
  document.addEventListener('error', dropDeadVideo, true);

  // Длинные отзывы сворачиваем до 5 строк с кнопкой «Читать полностью» — карточки не растягиваются
  function clampReviews(root = document) {
    $$('.review > p:not([data-clamp])', root).forEach(p => {
      p.dataset.clamp = 1;
      if (p.textContent.length < 180) return;
      p.classList.add('is-clamped');
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'review__more'; b.textContent = 'Читать полностью';
      b.onclick = () => { const open = p.classList.toggle('is-clamped'); b.textContent = open ? 'Читать полностью' : 'Свернуть'; };
      p.after(b);
    });
  }
  new MutationObserver(() => clampReviews()).observe(document.documentElement, { childList: true, subtree: true });

  // ---------- Формы-заявки ----------
  // <form data-demo="Текст успеха"> — проверка полей и согласия, без отправки на сервер (прототип)
  const consent = (text = 'Соглашаюсь с <a href="policy.html" target="_blank">политикой конфиденциальности</a> и даю согласие на обработку персональных данных ООО «Колба».') => `
    <label class="check"><input type="checkbox" name="consent" required><span>${text}</span></label>`;
  const field = (name, label, { type = 'text', required = true, placeholder = '', textarea = false, value = '' } = {}) => `
    <label class="field">
      <span class="field__label">${label}${required ? '' : ' <small>(необязательно)</small>'}</span>
      ${textarea
        ? `<textarea name="${name}" rows="3" placeholder="${e(placeholder)}" ${required ? 'required' : ''}>${e(value)}</textarea>`
        : `<input name="${name}" type="${type}" placeholder="${e(placeholder)}" value="${e(value)}" ${required ? 'required' : ''} ${type === 'tel' ? 'inputmode="tel" autocomplete="tel" pattern="[+0-9 ()-]{10,}"' : ''} ${name === 'name' ? 'autocomplete="name"' : ''}>`}
    </label>`;
  const leadForm = ({ title = 'Оставьте заявку', text = 'Администратор перезвонит, ответит на вопросы и подберёт удобное время.', button = 'Отправить заявку', success = 'Спасибо! Администратор свяжется с вами в ближайшее время.', extra = '' } = {}) => `
    <form class="lead-form" data-demo="${e(success)}" novalidate>
      <h2 class="h-section">${title}</h2>
      ${text ? `<p class="lead-form__text">${text}</p>` : ''}
      <div class="lead-form__fields">
        ${field('name', 'Имя', { placeholder: 'Как к вам обращаться' })}
        ${field('phone', 'Телефон', { type: 'tel', placeholder: '+7 (___) ___-__-__' })}
        ${extra}
      </div>
      ${consent()}
      <button class="btn" type="submit">${button}</button>
    </form>`;

  document.addEventListener('submit', ev => {
    const f = ev.target.closest('form[data-demo]'); if (!f) return;
    ev.preventDefault();
    let ok = true;
    $$('[required]', f).forEach(inp => {
      const bad = inp.type === 'checkbox' ? !inp.checked : !inp.value.trim() || (inp.pattern && !new RegExp(`^${inp.pattern}$`).test(inp.value.trim()));
      (inp.closest('.field, .check') || inp).classList.toggle('is-error', bad);
      if (bad) ok = false;
    });
    if (!ok) { $('.is-error input, .is-error textarea', f)?.focus(); return; }
    f.innerHTML = `<div class="done"><div class="done__icon">✓</div><p>${f.dataset.demo}</p></div>`;
  });
  document.addEventListener('input', ev => ev.target.closest('.is-error')?.classList.remove('is-error'));

  // ---------- Онлайн-запись ----------
  // Короткие названия направлений (заголовки страниц на сайте длинные)
  const CAT_SHORT = { okrashivanie: 'Окрашивание', 'strizhki-i-ukladki': 'Стрижки и укладки', uhody: 'Уходы', 'nogtevoj-servis': 'Ногтевой сервис', 'uslugi-vizazhista': 'Услуги визажиста', 'dlya-muzhchin': 'Для мужчин' };
  const catTitle = c => CAT_SHORT[c?.slug || c] || c?.title || '';
  const CAT_TO_TEAM = { okrashivanie: 'stilist', 'strizhki-i-ukladki': 'stilist', uhody: 'stilist', 'dlya-muzhchin': 'stilist', 'nogtevoj-servis': 'mastera-nogtevogo-servisa', 'uslugi-vizazhista': 'vizazhist' };
  const masters = () => (typeof MASTERS !== 'undefined' ? MASTERS : []);
  const cats = () => (typeof SERVICE_CATEGORIES !== 'undefined' ? SERVICE_CATEGORIES : []);
  const minPrice = it => Math.min(...Object.values(it.price || {}).filter(v => v != null));

  function booking(preset = {}) {
    const st = { cat: null, service: null, master: null, day: null, time: null, ...preset };
    if (st.service && !st.cat) st.cat = cats().find(c => c.groups.some(g => g.items.some(i => i.slug === st.service)))?.slug || null;
    if (st.master && !st.cat) { const m = masters().find(x => x.id == st.master); st.cat = Object.keys(CAT_TO_TEAM).find(k => CAT_TO_TEAM[k] === m?.cat) || null; }
    const m = modal('<div class="book"></div>', { cls: 'modal__box--book' });
    const root = $('.book', m.el);
    const days = [...Array(14)].map((_, k) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + k); return d; });
    const slots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
    const busy = (d, t) => ((d.getDate() * 7 + parseInt(t) * 3 + (st.master || 1)) % 5 === 0); // демо-занятость
    const fmtDay = d => d.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' });
    const svc = () => { for (const c of cats()) for (const g of c.groups) for (const i of g.items) if ((i.slug || i.name) === st.service) return i; return null; };
    const steps = ['Услуга', 'Мастер', 'Время', 'Контакты'];
    let step = st.service ? (st.master ? 2 : 1) : 0;

    const summary = () => {
      const s = svc(), ms = masters().find(x => x.id == st.master);
      return `<ul class="book__summary">
        ${s ? `<li><span>Услуга</span><b>${e(s.name)}</b><em>от ${rub(minPrice(s))}</em></li>` : ''}
        <li><span>Мастер</span><b>${ms ? e(ms.name) : 'Любой свободный'}</b></li>
        ${st.day != null ? `<li><span>Когда</span><b>${fmtDay(days[st.day])}, ${st.time}</b></li>` : ''}
      </ul>`;
    };
    const render = () => {
      const bar = `<ol class="book__steps">${steps.map((s, k) => `<li class="${k === step ? 'is-current' : k < step ? 'is-done' : ''}">${s}</li>`).join('')}</ol>`;
      let body = '';
      if (step === 0) {
        const c = st.cat || cats()[0]?.slug;
        const cat = cats().find(x => x.slug === c);
        body = `<h2 class="book__title">Выберите услугу</h2>
          <div class="book__cats" data-cats></div>
          <div class="book__list">${cat ? cat.groups.map(g => `
            ${g.title ? `<h3>${e(g.title)}</h3>` : ''}
            ${g.items.map(i => `<button type="button" class="book__row" data-service="${e(i.slug || i.name)}"><span>${e(i.name)}</span><b>от ${rub(minPrice(i))}</b></button>`).join('')}`).join('') : '<p>Список услуг загружается…</p>'}</div>`;
      } else if (step === 1) {
        const team = masters().filter(x => !st.cat || x.cat === CAT_TO_TEAM[st.cat]);
        body = `<h2 class="book__title">Выберите мастера</h2>
          <div class="book__masters">
            <button type="button" class="book__master" data-master=""><span class="book__any">?</span><b>Любой свободный</b><small>Подберём по времени</small></button>
            ${team.map(x => `<button type="button" class="book__master${x.id == st.master ? ' is-active' : ''}" data-master="${x.id}">${photoHTML(x)}<b>${e(x.name)}</b><small>${e(x.role)}</small></button>`).join('')}
          </div>`;
      } else if (step === 2) {
        body = `<h2 class="book__title">Выберите дату и время</h2>
          <div class="book__days">${days.map((d, k) => `<button type="button" data-day="${k}" class="${k === st.day ? 'is-active' : ''}">${fmtDay(d)}</button>`).join('')}</div>
          ${st.day != null ? `<div class="book__slots">${slots.map(t => `<button type="button" data-time="${t}" ${busy(days[st.day], t) ? 'disabled' : ''} class="${t === st.time ? 'is-active' : ''}">${t}</button>`).join('')}</div>` : '<p class="book__hint">Сначала выберите день — покажем свободное время.</p>'}`;
      } else if (step === 3) {
        body = `<h2 class="book__title">Ваши контакты</h2>${summary()}
          <form data-demo="Вы записаны! Администратор позвонит, чтобы подтвердить визит. До встречи в ColBa." novalidate>
            <div class="lead-form__fields">
              ${field('name', 'Имя', { placeholder: 'Как к вам обращаться' })}
              ${field('phone', 'Телефон', { type: 'tel', placeholder: '+7 (___) ___-__-__' })}
              ${field('comment', 'Комментарий', { required: false, textarea: true, placeholder: 'Например, хочу обсудить цвет с мастером' })}
            </div>
            ${consent()}
            <button class="btn" type="submit">Записаться</button>
          </form>`;
      }
      root.innerHTML = bar + `<div class="book__body">${body}</div>` +
        `<div class="book__foot">${step > 0 ? '<button type="button" class="btn btn--ghost" data-back>Назад</button>' : '<span></span>'}
         <a class="book__call" href="tel:+74991102210">или позвоните: 8 499 110-22-10</a></div>`;
      const catsEl = $('[data-cats]', root);
      if (catsEl) tabs(catsEl, cats().map(c => ({ v: c.slug, l: catTitle(c) })), st.cat || cats()[0]?.slug, v => { st.cat = v; render(); });
      fitAll(root);
    };
    root.addEventListener('click', ev => {
      const t = ev.target.closest('button'); if (!t) return;
      if (t.dataset.service) { st.service = t.dataset.service; st.cat = st.cat || cats()[0]?.slug; step = st.master ? 2 : 1; }
      else if ('master' in t.dataset) { st.master = t.dataset.master ? +t.dataset.master : null; step = 2; }
      else if (t.dataset.day) { st.day = +t.dataset.day; st.time = null; }
      else if (t.dataset.time) { st.time = t.dataset.time; step = 3; }
      else if ('back' in t.dataset) { step--; }
      else return;
      render();
      $('.book__body', root)?.scrollTo?.(0, 0);
    });
    render();
  }

  // Любая кнопка «Записаться»: href="#book" или data-book (data-service, data-master)
  document.addEventListener('click', ev => {
    const b = ev.target.closest('a[href="#book"], [data-book], .ms_booking'); if (!b) return;
    ev.preventDefault();
    booking({ service: b.dataset.service || null, master: b.dataset.master ? +b.dataset.master : null });
  });

  // Тест на образ открывается отдельной страницей, отзыв — модальным окном
  function reviewForm(masterId) {
    const list = masters();
    modal(`<form data-demo="Спасибо за отзыв! Он появится на сайте после проверки." novalidate class="lead-form">
      <h2 class="h-section">Оставить отзыв</h2>
      <div class="lead-form__fields">
        <label class="field"><span class="field__label">Мастер</span>
          <select name="master" required><option value="">Выберите мастера</option>${list.map(x => `<option value="${x.id}" ${x.id == masterId ? 'selected' : ''}>${e(x.name)}</option>`).join('')}</select></label>
        <div class="field"><span class="field__label">Оценка</span>
          <div class="rate">${[5, 4, 3, 2, 1].map(n => `<input type="radio" name="rating" id="r${n}" value="${n}" ${n === 5 ? 'checked' : ''}><label for="r${n}" title="${n}">★</label>`).join('')}</div></div>
        ${field('name', 'Имя', { placeholder: 'Как вас подписать' })}
        ${field('text', 'Отзыв', { textarea: true, placeholder: 'Что понравилось, что можно улучшить' })}
      </div>
      ${consent()}
      <button class="btn" type="submit">Отправить отзыв</button>
    </form>`, { cls: 'modal__box--form' });
  }
  document.addEventListener('click', ev => {
    const b = ev.target.closest('[data-review]'); if (!b) return;
    ev.preventDefault(); reviewForm(b.dataset.review);
  });

  // Фото для услуги: свои → фото направления → работы галереи с подходящим тегом (без повторов)
  const GALLERY_TAGS = { okrashivanie: ['okrashivanie-1'], 'strizhki-i-ukladki': ['strizhka-3', 'ukladka-2'], uhody: ['ukladka-2', 'okrashivanie-1'], 'uslugi-vizazhista': ['makiyazh-9'], 'dlya-muzhchin': [], 'nogtevoj-servis': [] };
  function servicePhotos(slug, cat, limit = 12) {
    const own = (typeof SERVICES !== 'undefined' && SERVICES[slug]?.photos) || [];
    const catP = (typeof SERVICE_ABOUT !== 'undefined' && SERVICE_ABOUT[cat]?.photos) || [];
    const tags = GALLERY_TAGS[cat] || [];
    const gal = typeof GALLERY !== 'undefined' ? GALLERY.filter(p => p.props.some(t => tags.includes(t))).map(p => p.img) : [];
    const sib = typeof SERVICES !== 'undefined' ? Object.values(SERVICES).filter(x => x.cat === cat && x.slug !== slug).flatMap(x => x.photos || []) : [];
    return [...new Set([...own, ...catP, ...sib, ...gal])].slice(0, limit);
  }
  // Обложка услуги в списке: своё фото, иначе — фото направления/галереи по индексу (соседние разные)
  function serviceCover(slug, cat, k = 0) {
    const own = (typeof SERVICES !== 'undefined' && SERVICES[slug]?.photos?.[0]);
    if (own) return own;
    const pool = servicePhotos('', cat, 40);
    return pool.length ? pool[k % pool.length] : null;
  }

  // Ссылки внутри текстов (описания услуг, статьи) на услуги и статьи, которых нет в данных, — делаем обычным текстом
  function fixLinks(root) {
    const slugs = new Set(cats().flatMap(c => c.groups.flatMap(g => g.items.map(i => i.slug))).filter(Boolean));
    const posts = typeof BLOG !== 'undefined' ? new Set(BLOG.map(p => p.slug)) : null;
    $$('a[href^="service.html?id="], a[href^="post.html?id="]', root).forEach(a => {
      const id = new URL(a.href).searchParams.get('id');
      const ok = a.getAttribute('href').startsWith('service') ? slugs.has(id) : !posts || posts.has(id);
      if (!ok) a.replaceWith(...a.childNodes);
    });
  }

  return { $, $$, e, img, rub, param, crumbs, head, arrows, initRails, tabs, modal, lightbox, field, consent, leadForm, booking, reviewForm, fixLinks, catTitle, servicePhotos, serviceCover, UP };
})();
