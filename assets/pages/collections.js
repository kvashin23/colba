// Коллекции: collections.html — список, collections.html?id=slug — коллекция
(() => {
  const { e, param, head, img } = UI;
  const app = document.getElementById('app');
  const c = COLLECTIONS.find(x => x.slug === param('id'));

  if (!c) {
    app.innerHTML = `
      ${head({ title: 'Наши<br>коллекции', crumbs: [['Портфолио', 'gallery.html'], ['Коллекции']], lead: 'Ежегодно Colba создаёт коллекции окрашиваний и стрижек, в которых отражаются не только основные тенденции индустрии, но и особое видение мастеров лаборатории.' })}
      <section class="block block--tight"><div class="cards" style="--cols:3">${COLLECTIONS.map(x => `
        <a class="card" href="collections.html?id=${x.slug}">
          <div class="card__img card__img--tall"><img src="${img(x.photos[0] || x.cover)}" alt="" loading="lazy"></div>
          <p class="card__meta">${x.photos.length} ${plural(x.photos.length, 'фотография', 'фотографии', 'фотографий')}</p>
          <h3>${e(x.title)}</h3>
        </a>`).join('')}</div></section>`;
    return;
  }

  document.title = `Коллекция ${c.title} — Colba Color Bar`;
  const others = COLLECTIONS.filter(x => x !== c);
  app.innerHTML = `
    ${head({ title: e(c.title), small: true, crumbs: [['Портфолио', 'gallery.html'], ['Коллекции', 'collections.html'], [c.title]],
      lead: `Коллекция Colba Color Bar · ${c.photos.length} ${plural(c.photos.length, 'фотография', 'фотографии', 'фотографий')}`,
      extra: '<div class="page-head__actions"><a class="btn" href="#book">Хочу такой образ</a></div>' })}
    <section class="block block--tight"><div class="photo-grid" style="--cols:4">${c.photos.map(p => `<a href="${img(p)}" data-lightbox="coll"><img src="${img(p)}" alt="${e(c.title)}" loading="lazy"></a>`).join('')}</div></section>
    <section class="block" aria-labelledby="more-h">
      <div class="block__head"><h2 class="h-section" id="more-h">Другие коллекции</h2><a class="link-more" href="collections.html">Все коллекции</a></div>
      <div class="cards" style="--cols:3">${others.slice(0, 3).map(x => `
        <a class="card" href="collections.html?id=${x.slug}"><div class="card__img card__img--tall"><img src="${img(x.photos[0] || x.cover)}" alt="" loading="lazy"></div><h3>${e(x.title)}</h3></a>`).join('')}</div>
    </section>`;
})();
