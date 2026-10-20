// Страница услуги: service.html?id=slug
(() => {
  const { e, rub, param, head, arrows, initRails, img } = UI;
  const app = document.getElementById('app');
  const LEN = { short: 'Короткие', mid: 'Средние', long: 'Длинные', one: 'Стоимость' };
  const s = SERVICES[param('id')];
  if (!s) {
    app.innerHTML = `${head({ title: 'Услуга не найдена', lead: 'Возможно, её уже нет в прайсе. Посмотрите все услуги и цены.', crumbs: [['Услуги', 'services.html']], extra: '<div class="page-head__actions"><a class="btn" href="services.html">Все услуги</a></div>' })}`;
    return;
  }
  const cat = SERVICE_CATEGORIES.find(c => c.slug === s.cat);
  const item = cat?.groups.flatMap(g => g.items).find(i => i.slug === s.slug);
  const title = s.title || s.name;
  document.title = `${title} — цена в Colba Color Bar`;

  const prices = item ? Object.entries(item.price).filter(([, v]) => v != null) : [];
  const order = ['short', 'mid', 'long', 'one'];
  prices.sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
  const others = cat ? cat.groups.flatMap(g => g.items).filter(i => i.slug && i.slug !== s.slug) : [];
  // Карточка услуги с фото: своё фото услуги, иначе — фото направления (разное для соседних карточек)
  const works = UI.servicePhotos(s.slug, s.cat);
  const serviceCard = (i, k) => {
    const pic = UI.serviceCover(i.slug, s.cat, k + 1);
    const v = Object.values(i.price).filter(x => x != null);
    return `<a class="svc-card" href="service.html?id=${e(i.slug)}">
      <div class="svc-card__img">${pic ? `<img src="${img(pic)}" alt="" loading="lazy">` : ''}</div>
      <h3>${e(i.name)}</h3>
      <p>${v.length ? `<b>от ${rub(Math.min(...v))}</b>` : ''}${Object.values(i.time)[0] ? `<span>${e(Object.values(i.time)[0])}</span>` : ''}</p>
    </a>`;
  };
  const minP = prices.length ? Math.min(...prices.map(p => p[1])) : null;

  app.innerHTML = `
    ${head({
      title: e(title),
      crumbs: [['Услуги', 'services.html'], [UI.catTitle(cat), `services.html?cat=${s.cat}`], [title]],
      small: true,
      extra: `
        <div class="chips-info">
          ${s.duration ? `<span class="chip-info">⏱ ${e(s.duration)}</span>` : ''}
          ${minP != null ? `<span class="chip-info">от ${rub(minP)}</span>` : ''}
          ${item?.note ? `<span class="chip-info">${e(item.note)}</span>` : ''}
        </div>
        ${prices.length > 1 ? `<div class="price-cards">${prices.map(([k, v]) => `<div class="price-card"><span>${LEN[k] || k}</span><b>${rub(v)}</b></div>`).join('')}</div>` : ''}
        <div class="page-head__actions">
          <a class="btn" href="#book" data-book data-service="${e(s.slug)}">Записаться на услугу</a>
          ${works.length ? '<a class="btn btn--ghost" href="#works">Смотреть работы</a>' : ''}
        </div>` })}

    ${works.length ? `
    <section class="block" id="works" aria-labelledby="works-h">
      <div class="block__head"><div><h2 class="h-section" id="works-h">Сделаем так же круто</h2><p>Работы наших мастеров</p></div><a class="link-more" href="gallery.html">Все работы</a></div>
      <div class="rail rail--six" id="svcWorks" style="--n:${works.length}">${works.map(p => `<a class="photo" style="display:block" href="${img(p)}" data-lightbox="svc"><img src="${img(p)}" alt="${e(title)}" loading="lazy"></a>`).join('')}</div>
      ${arrows('svcWorks')}
    </section>` : ''}

    <section class="block split">
      <div class="panel">
        <h2 class="h-section" style="margin-bottom:24px">О процедуре</h2>
        <div class="prose">${s.text || '<p>Подробности расскажет администратор или мастер на консультации.</p>'}</div>
      </div>
      <aside class="panel sticky">
        ${UI.leadForm({ title: 'Хотите записаться?', text: `Оставьте телефон — администратор подберёт мастера и время на «${e(title)}».`, button: 'Жду звонка' })}
      </aside>
    </section>

    ${others.length ? `
    <section class="block" aria-labelledby="more-h">
      <div class="block__head"><h2 class="h-section" id="more-h">Другие услуги: ${e(UI.catTitle(cat).toLowerCase())}</h2><a class="link-more" href="services.html?cat=${s.cat}">Весь прайс</a></div>
      <div class="rail rail--six" id="moreSvc">${others.map((i, k) => serviceCard(i, k)).join('')}</div>
      ${arrows('moreSvc')}
    </section>` : ''}`;
  UI.fixLinks(app);
  initRails(app);
})();
