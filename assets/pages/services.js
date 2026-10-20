// Услуги и цены: services.html — все направления, services.html?cat=slug — направление
(() => {
  const { e, rub, param, head, arrows, initRails, tabs, img, catTitle } = UI;
  const app = document.getElementById('app');
  const LEN = [['short', 'Короткие'], ['mid', 'Средние'], ['long', 'Длинные']];
  const items = c => c.groups.flatMap(g => g.items);
  const count = c => items(c).length;
  const minPrice = c => Math.min(...items(c).flatMap(i => Object.values(i.price).filter(v => v != null)));
  const firstSentence = c => {
    const t = (SERVICE_ABOUT[c.slug]?.about || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const s = t.split(/(?<=[.!?])\s/)[0] || '';
    return s.length <= 170 ? s : '';
  };

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
  const table = (c, len) => c.groups.map(g => `${g.title ? `<h3>${e(g.title)}</h3>` : ''}${g.items.map(i => row(i, len)).join('')}`).join('');

  // Витрина с фото: карточка услуги с ценой для выбранной длины волос
  function tile(i, len, cat, k) {
    const key = i.price[len] != null ? len : (i.price.one != null ? 'one' : null);
    const any = Object.values(i.price).filter(v => v != null);
    const price = key ? rub(i.price[key]) : (any.length ? 'от ' + rub(Math.min(...any)) : '');
    const time = (key && i.time[key]) || Object.values(i.time)[0] || '';
    const pic = UI.serviceCover(i.slug, cat, k);
    const inner = `
      <div class="svc-card__img">${pic ? `<img src="${img(pic)}" alt="" loading="lazy">` : ''}</div>
      <h3>${e(i.name)}</h3>
      ${i.note ? `<small class="svc-card__note">${e(i.note)}</small>` : ''}
      <p>${price ? `<b>${price}</b>` : ''}${time ? `<span>${e(time)}</span>` : ''}</p>`;
    return i.slug ? `<a class="svc-card" href="service.html?id=${e(i.slug)}">${inner}</a>` : `<div class="svc-card svc-card--static">${inner}</div>`;
  }
  const tiles = (c, len) => { let k = 0; return c.groups.map(g => `${g.title ? `<h3>${e(g.title)}</h3>` : ''}<div class="svc-grid">${g.items.map(i => tile(i, len, c.slug, k++)).join('')}</div>`).join(''); };

  // Вид прайса запоминаем: «С фото» (по умолчанию) или «Списком»
  const VIEW_KEY = 'colba:services-view';
  let view = 'photo';
  try { view = localStorage.getItem(VIEW_KEY) || 'photo'; } catch (_) {}

  // Прайс: слева — сводка и запись, справа — услуги с переключателями вида и длины волос
  function priceBlock(c, mount) {
    let len = 'mid';
    mount.innerHTML = `
      <div class="price-layout">
        <aside class="price-aside">
          <p class="price-aside__kicker">${count(c)} ${plural(count(c), 'услуга', 'услуги', 'услуг')}</p>
          <h3 class="price-aside__title">${e(catTitle(c))}</h3>
          <p class="price-aside__from">от <b>${rub(minPrice(c))}</b></p>
          ${c.lengths ? '<p class="price-aside__note">Цена зависит от длины волос. Нарощенные или густые — +30%. Точную стоимость мастер назовёт на консультации.</p>' : '<p class="price-aside__note">Точную стоимость администратор подтвердит при записи.</p>'}
          <a class="btn" href="#book">Записаться</a>
          <a class="price-aside__call" href="tel:+74991102210">или позвоните: 8 499 110-22-10</a>
        </aside>
        <div class="price-table">
          <div class="price-table__bar">
            <div data-view class="seg seg--view"></div>
            ${c.lengths ? '<div class="price-table__len"><span>Длина волос</span><div data-len class="seg"></div></div>' : ''}
          </div>
          <div data-table></div>
        </div>
      </div>`;
    const box = mount.querySelector('.price-table');
    const draw = () => {
      box.classList.toggle('is-photo', view === 'photo');
      mount.querySelector('[data-table]').innerHTML = view === 'photo' ? tiles(c, len) : table(c, len);
      UI.fixLinks(mount);
    };
    tabs(mount.querySelector('[data-view]'), [{ v: 'photo', l: 'С фото' }, { v: 'list', l: 'Списком' }], view, v => {
      view = v; try { localStorage.setItem(VIEW_KEY, v); } catch (_) {}
      draw();
    });
    if (c.lengths) tabs(mount.querySelector('[data-len]'), LEN.map(([v, l]) => ({ v, l })), len, v => { len = v; draw(); });
    draw();
  }

  const catCard = (c, n) => `
    <a class="cat-card" href="services.html?cat=${c.slug}">
      <div class="cat-card__top"><span class="cat-card__num">${String(n + 1).padStart(2, '0')}</span><span class="cat-card__count">${count(c)} ${plural(count(c), 'услуга', 'услуги', 'услуг')}</span></div>
      <div>
        <h2>${e(catTitle(c))}</h2>
        <ul class="cat-card__list">${items(c).filter(i => i.slug).slice(0, 3).map(i => `<li>${e(i.name)}</li>`).join('')}</ul>
        <p class="cat-card__from">от ${rub(minPrice(c))}</p>
      </div>
    </a>`;

  const cat = SERVICE_CATEGORIES.find(c => c.slug === param('cat'));

  if (!cat) {
    document.title = 'Услуги и цены — Colba Color Bar';
    app.innerHTML = `
      ${head({ title: 'Услуги<br>и цены', lead: 'Окрашивания любой сложности, уходы, стрижки, ногтевой сервис и услуги визажиста. Цены указаны «от» — точную стоимость мастер назовёт после консультации.', crumbs: [['Услуги']] })}
      <section class="block block--tight"><div class="cat-grid">${SERVICE_CATEGORIES.map(catCard).join('')}</div></section>
      <section class="block" aria-labelledby="price-h">
        <div class="block__head"><div><h2 class="h-section" id="price-h">Прайс-лист</h2><p>Выберите направление и длину волос</p></div></div>
        <div data-cat-tabs class="price-cats"></div>
        <div data-prices></div>
      </section>`;
    const mount = app.querySelector('[data-prices]');
    tabs(app.querySelector('[data-cat-tabs]'), SERVICE_CATEGORIES.map(c => ({ v: c.slug, l: catTitle(c), n: count(c) })), SERVICE_CATEGORIES[0].slug,
      v => priceBlock(SERVICE_CATEGORIES.find(c => c.slug === v), mount));
    priceBlock(SERVICE_CATEGORIES[0], mount);
    return;
  }

  // ---------- Направление ----------
  const about = SERVICE_ABOUT[cat.slug] || {};
  document.title = `${cat.title} — цены в Colba Color Bar`;
  app.innerHTML = `
    ${head({ title: e(cat.title), lead: e(firstSentence(cat)), crumbs: [['Услуги', 'services.html'], [catTitle(cat)]],
      extra: `<div class="page-head__actions"><a class="btn" href="#book">Записаться</a>${about.about ? '<a class="btn btn--ghost" href="#about">О процедуре</a>' : ''}</div>` })}
    <section class="block block--tight" aria-label="Цены"><div data-prices></div></section>
    ${about.photos?.length ? `
    <section class="block" aria-labelledby="works-h">
      <div class="block__head"><div><h2 class="h-section" id="works-h">Сделаем так же круто</h2><p>Работы наших мастеров</p></div><a class="link-more" href="gallery.html">Все работы</a></div>
      <div class="rail rail--six" id="catWorks">${about.photos.map(p => `<a class="photo" style="display:block" href="${img(p)}" data-lightbox="cat"><img src="${img(p)}" alt="" loading="lazy"></a>`).join('')}</div>
      ${arrows('catWorks')}
    </section>` : ''}
    ${about.about ? `
    <section class="block" id="about" aria-labelledby="about-h">
      <div class="panel reading">
        <h2 class="h-section" id="about-h">О процедуре</h2>
        <div><div class="prose more is-collapsed" data-more>${about.about}</div>
        <button class="btn btn--ghost more-btn" type="button" data-more-btn>Читать полностью</button></div>
      </div>
    </section>` : ''}
    <section class="block" aria-labelledby="other-h">
      <div class="block__head"><h2 class="h-section" id="other-h">Другие направления</h2><a class="link-more" href="services.html">Все услуги</a></div>
      <div class="cat-grid">${SERVICE_CATEGORIES.map((c, n) => [c, n]).filter(([c]) => c !== cat).slice(0, 3).map(([c, n]) => catCard(c, n)).join('')}</div>
    </section>`;
  priceBlock(cat, app.querySelector('[data-prices]'));
  const more = app.querySelector('[data-more]'), btn = app.querySelector('[data-more-btn]');
  if (more && more.scrollHeight < 420) { more.classList.remove('is-collapsed'); btn.remove(); }
  btn?.addEventListener('click', () => { more.classList.toggle('is-collapsed'); btn.textContent = more.classList.contains('is-collapsed') ? 'Читать полностью' : 'Свернуть'; });
  UI.fixLinks(app);
  initRails(app);
})();
