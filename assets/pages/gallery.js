// Наши работы: gallery.html (фото, фильтры) и gallery.html?tab=video
(() => {
  const { e, param, head, tabs, img, $$ } = UI;
  const app = document.getElementById('app');
  const PAGE = 20;
  let tab = param('tab') === 'video' ? 'video' : 'photo';
  const picked = {};               // key -> Set(values)
  let shown = PAGE;

  app.innerHTML = `
    ${head({ title: 'Наши<br>работы', crumbs: [['Портфолио']], lead: 'Окрашивания, стрижки, укладки и макияж наших мастеров. Нажмите на фото, чтобы рассмотреть поближе.',
      extra: '<div data-tabs></div><div class="dd-filters" data-filters></div>' })}
    <section class="block block--tight"><div data-grid></div><div class="load-more" data-more></div></section>
    <section class="block cta"><h2>Понравилась работа? <em>Покажите фото мастеру</em> — повторим или подберём похожее.</h2><a class="btn" href="#book">Записаться</a></section>
    <section class="block" aria-labelledby="coll-h">
      <div class="block__head"><h2 class="h-section" id="coll-h">Наши коллекции</h2><a class="link-more" href="collections.html">Все коллекции</a></div>
      <div class="cards" style="--cols:3">${COLLECTIONS.slice(0, 3).map(c => `
        <a class="card" href="collections.html?id=${c.slug}"><div class="card__img card__img--tall"><img src="${img(c.cover)}" alt="" loading="lazy"></div><h3>${e(c.title)}</h3></a>`).join('')}</div>
    </section>`;

  const grid = app.querySelector('[data-grid]');
  const more = app.querySelector('[data-more]');
  const filtersEl = app.querySelector('[data-filters]');

  tabs(app.querySelector('[data-tabs]'), [{ v: 'photo', l: 'Фото', n: GALLERY.length }, { v: 'video', l: 'Видео', n: GALLERY_VIDEOS.length }], tab, v => {
    tab = v; shown = PAGE;
    const u = new URL(location); v === 'video' ? u.searchParams.set('tab', 'video') : u.searchParams.delete('tab'); history.replaceState(null, '', u);
    render();
  });

  // Выпадающие фильтры
  filtersEl.innerHTML = GALLERY_FILTERS.map(f => `
    <div class="dd" data-key="${f.key}">
      <button type="button" aria-expanded="false">${e(f.label)} <b hidden></b></button>
      <div class="dd__menu">${f.options.map(o => `<label><input type="checkbox" value="${e(o.v)}"> ${e(o.l)}</label>`).join('')}</div>
    </div>`).join('') + '<button class="dd-reset" type="button" hidden>Сбросить</button>';
  filtersEl.addEventListener('click', ev => {
    const btn = ev.target.closest('.dd > button');
    if (btn) {
      const dd = btn.parentElement, open = !dd.classList.contains('is-open');
      $$('.dd', filtersEl).forEach(x => { x.classList.remove('is-open'); x.firstElementChild.setAttribute('aria-expanded', 'false'); });
      dd.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', open);
    }
    if (ev.target.closest('.dd-reset')) {
      $$('input', filtersEl).forEach(i => (i.checked = false));
      Object.keys(picked).forEach(k => delete picked[k]); shown = PAGE; render();
    }
  });
  filtersEl.addEventListener('change', ev => {
    const dd = ev.target.closest('.dd'); const key = dd.dataset.key;
    picked[key] = new Set($$('input:checked', dd).map(i => i.value));
    shown = PAGE; render();
  });
  document.addEventListener('click', ev => { if (!ev.target.closest('.dd')) $$('.dd.is-open', filtersEl).forEach(x => x.classList.remove('is-open')); });

  function render() {
    filtersEl.hidden = tab === 'video';
    if (tab === 'video') {
      grid.innerHTML = `<div class="photo-grid photo-grid--video" style="--cols:3">${GALLERY_VIDEOS.map(id => `
        <a class="video-tile" href="https://www.youtube.com/watch?v=${id}" data-video="${id}" data-group="gal"><img src="https://i.ytimg.com/vi_webp/${id}/maxresdefault.webp" alt="Видео работы" loading="lazy"></a>`).join('')}</div>`;
      more.innerHTML = '';
      return;
    }
    const active = Object.entries(picked).filter(([, s]) => s.size);
    const list = GALLERY.filter(p => active.every(([, s]) => p.props.some(v => s.has(v))));
    $$('.dd', filtersEl).forEach(dd => { const n = picked[dd.dataset.key]?.size || 0; const b = dd.querySelector('b'); b.hidden = !n; b.textContent = n; });
    filtersEl.querySelector('.dd-reset').hidden = !active.length;
    grid.innerHTML = list.length
      ? `<div class="photo-grid">${list.slice(0, shown).map(p => `<a href="${img(p.img)}" data-lightbox="gallery"><img src="${img(p.img)}" alt="Работа Colba Color Bar" loading="lazy"></a>`).join('')}</div>`
      : '<p class="empty">По выбранным фильтрам работ пока нет. Попробуйте изменить условия.</p>';
    more.innerHTML = list.length > shown ? `<button class="btn btn--ghost" type="button">Показать ещё ${Math.min(PAGE, list.length - shown)}</button>` : '';
  }
  more.addEventListener('click', () => { shown += PAGE; render(); });
  render();
})();
