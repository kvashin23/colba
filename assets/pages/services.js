// Услуги и цены: services.html — все категории, services.html?cat=slug — категория
(() => {
  const { e, rub, param, head, arrows, initRails, tabs, img } = UI;
  const app = document.getElementById('app');
  const LETTERS = { okrashivanie: 'O', 'strizhki-i-ukladki': 'S', uhody: 'U', 'nogtevoj-servis': 'N', 'uslugi-vizazhista': 'Us', 'dlya-muzhchin': 'M' };
  const LEN = [['short', 'Короткие'], ['mid', 'Средние'], ['long', 'Длинные']];
  const count = c => c.groups.reduce((n, g) => n + g.items.length, 0);
  const lead = c => {
    const t = (SERVICE_ABOUT[c.slug]?.about || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return t.split(/(?<=[.!?])\s/)[0].slice(0, 140);
  };
  const plainTitle = UI.catTitle;

  // Строка прайса для выбранной длины волос
  function row(i, len) {
    const key = i.price[len] != null ? len : (i.price.one != null ? 'one' : null);
    const any = Object.values(i.price).filter(v => v != null);
    const price = key ? rub(i.price[key]) : (any.length ? '—' : '');
    const time = (key && i.time[key]) || Object.values(i.time)[0] || '';
    const inner = `
      <span class="price-row__name">${e(i.name)}${i.note ? `<small>${e(i.note)}</small>` : ''}</span>
      <span class="price-row__time">${e(time)}</span>
      <span class="price-row__price">${price}</span>`;
    return i.slug ? `<a class="price-row" href="service.html?id=${e(i.slug)}">${inner}</a>` : `<div class="price-row">${inner}</div>`;
  }
  function table(c, len) {
    return `<div class="price-table">
      ${c.groups.map(g => `${g.title ? `<h3>${e(g.title)}</h3>` : ''}${g.items.map(i => row(i, len)).join('')}`).join('')}
      ${c.lengths ? '<p class="price-note">Нарощенные или густые волосы — +30% к цене. Точную стоимость мастер назовёт после консультации.</p>' : ''}
    </div>`;
  }
  // Переключатель длины волос + таблица
  function priceBlock(c, mount) {
    let len = 'mid';
    const draw = () => { mount.querySelector('[data-table]').innerHTML = table(c, len); };
    mount.innerHTML = `${c.lengths ? '<div data-len></div>' : ''}<div data-table></div>`;
    if (c.lengths) tabs(mount.querySelector('[data-len]'), LEN.map(([v, l]) => ({ v, l })), len, v => { len = v; draw(); });
    draw();
  }
  const catCard = c => `
    <a class="cat-card" href="services.html?cat=${c.slug}">
      <div class="cat-card__top"><span class="cat-card__letter">${LETTERS[c.slug] || ''}</span><span class="cat-card__count">${count(c)} ${plural(count(c), 'услуга', 'услуги', 'услуг')}</span></div>
      <div><h2>${e(plainTitle(c))}</h2><p>${e(lead(c))}</p></div>
    </a>`;

  const cat = SERVICE_CATEGORIES.find(c => c.slug === param('cat'));

  if (!cat) {
    document.title = 'Услуги и цены — Colba Color Bar';
    app.innerHTML = `
      ${head({ title: 'Услуги<br>и цены', lead: 'Окрашивания любой сложности, уходы, стрижки, ногтевой сервис и услуги визажиста. Цены указаны «от» — точную стоимость мастер назовёт после консультации.', crumbs: [['Услуги']] })}
      <section class="block block--tight"><div class="cat-grid">${SERVICE_CATEGORIES.map(catCard).join('')}</div></section>
      <section class="block" aria-labelledby="price-h">
        <div class="block__head"><div><h2 class="h-section" id="price-h">Прайс-лист</h2><p>Выберите направление и длину волос</p></div></div>
        <div data-cat-tabs style="padding:0 var(--gutter);margin-bottom:12px"></div>
        <div data-prices></div>
      </section>
      <section class="block cta"><h2>Не знаете, какую услугу выбрать? <em>Запишитесь на консультацию</em> — колорист подберёт технику и цвет.</h2><a class="btn" href="#book">Записаться</a></section>`;
    const mount = app.querySelector('[data-prices]');
    const catTabs = app.querySelector('[data-cat-tabs]');
    tabs(catTabs, SERVICE_CATEGORIES.map(c => ({ v: c.slug, l: plainTitle(c), n: count(c) })), SERVICE_CATEGORIES[0].slug,
      v => priceBlock(SERVICE_CATEGORIES.find(c => c.slug === v), mount));
    catTabs.style.marginTop = '0';
    priceBlock(SERVICE_CATEGORIES[0], mount);
    return;
  }

  // ---------- Категория ----------
  const about = SERVICE_ABOUT[cat.slug] || {};
  document.title = `${cat.title} — цены в Colba Color Bar`;
  app.innerHTML = `
    ${head({ title: e(cat.title), lead: e(lead(cat)), crumbs: [['Услуги', 'services.html'], [plainTitle(cat)]],
      extra: `<div class="page-head__actions"><a class="btn" href="#book">Записаться</a><a class="btn btn--ghost" href="#about">О процедуре</a></div>` })}
    <section class="block block--tight" aria-label="Цены"><div data-prices></div></section>
    ${about.photos?.length ? `
    <section class="block" aria-labelledby="works-h">
      <div class="block__head"><div><h2 class="h-section" id="works-h">Сделаем так же круто</h2><p>Работы наших мастеров</p></div><a class="link-more" href="gallery.html">Все работы</a></div>
      <div class="rail rail--six" id="catWorks">${about.photos.map(p => `<a class="photo" style="display:block" href="${img(p)}" data-lightbox="cat"><img src="${img(p)}" alt="" loading="lazy"></a>`).join('')}</div>
      ${arrows('catWorks')}
    </section>` : ''}
    ${about.about ? `
    <section class="block" id="about" aria-labelledby="about-h">
      <div class="panel">
        <h2 class="h-section" id="about-h" style="margin-bottom:24px">О процедуре</h2>
        <div class="prose prose--wide more is-collapsed" data-more>${about.about}</div>
        <button class="btn btn--ghost more-btn" type="button" data-more-btn>Читать полностью</button>
      </div>
    </section>` : ''}
    <section class="block" aria-labelledby="other-h">
      <div class="block__head"><h2 class="h-section" id="other-h">Другие направления</h2></div>
      <div class="cat-grid">${SERVICE_CATEGORIES.filter(c => c !== cat).slice(0, 3).map(catCard).join('')}</div>
    </section>`;
  priceBlock(cat, app.querySelector('[data-prices]'));
  const more = app.querySelector('[data-more]'), btn = app.querySelector('[data-more-btn]');
  if (more && more.scrollHeight < 420) { more.classList.remove('is-collapsed'); btn.remove(); }
  btn?.addEventListener('click', () => { more.classList.toggle('is-collapsed'); btn.textContent = more.classList.contains('is-collapsed') ? 'Читать полностью' : 'Свернуть'; });
  UI.fixLinks(app);
  initRails(app);
})();
