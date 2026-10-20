// Статья блога: post.html?id=slug. Текст подгружается из assets/data/blog/<slug>.json
(() => {
  const { e, head, param, img, crumbs } = UI;
  const app = document.getElementById('app');
  const LABELS = { okrashivaniya: 'Окрашивания', uhody: 'Уходы', ukladki: 'Укладки', makiyazh: 'Макияж', cvetotipirovanie: 'Цветотип', produkty: 'Продукты' };
  const i = BLOG.findIndex(p => p.slug === param('id'));
  const p = BLOG[i];
  if (!p) {
    app.innerHTML = head({ title: 'Статья не найдена', crumbs: [['Блог', 'blog.html']], extra: '<div class="page-head__actions"><a class="btn" href="blog.html">Все статьи</a></div>' });
    return;
  }
  document.title = `${p.title} — блог Colba Color Bar`;
  const card = x => `<a class="card" href="post.html?id=${e(x.slug)}"><div class="card__img"><img src="${img(x.img)}" alt="" loading="lazy"></div><p class="card__meta">${e(x.date)}</p><h3>${e(x.title)}</h3></a>`;
  const similar = BLOG.filter(x => x !== p && x.cats.some(c => p.cats.includes(c))).slice(0, 4);
  const prev = BLOG[i + 1], next = BLOG[i - 1];

  app.innerHTML = `
    ${crumbs([['Блог', 'blog.html'], [p.title]])}
    <header class="post-head">
      <div class="page-head post-head__text">
        <div class="post-head__tags">${p.cats.map(c => `<a href="blog.html?cat=${c}">${LABELS[c] || c}</a>`).join('')}</div>
        <h1 class="post-head__title">${e(p.title)}</h1>
        <p class="post-head__date">${e(p.date)} · Блог Colba Color Bar</p>
      </div>
      <div class="media-cover post-head__img"><img src="${img(p.img)}" alt=""></div>
    </header>
    <div class="block block--tight split">
      <article class="panel">
        <div class="prose" data-body><p style="color:var(--ink-soft)">Загружаем статью…</p></div>
        <nav class="post-nav">
          ${prev ? `<a href="post.html?id=${e(prev.slug)}"><small>← Предыдущая</small>${e(prev.title)}</a>` : '<span></span>'}
          ${next ? `<a href="post.html?id=${e(next.slug)}" style="text-align:right"><small>Следующая →</small>${e(next.title)}</a>` : '<span></span>'}
        </nav>
      </article>
      <aside class="panel sticky">
        ${UI.leadForm({ title: 'Нужна консультация колориста?', text: 'Оставьте телефон — подберём мастера и время, ответим на вопросы по статье.', button: 'Жду звонка' })}
      </aside>
    </div>
    ${similar.length ? `
    <section class="block" aria-labelledby="sim-h">
      <div class="block__head"><h2 class="h-section" id="sim-h">Читайте также</h2><a class="link-more" href="blog.html">Все статьи</a></div>
      <div class="cards blog-cards" style="--cols:4">${similar.map(card).join('')}</div>
    </section>` : ''}`;

  const body = app.querySelector('[data-body]');
  fetch(`assets/data/blog/${encodeURIComponent(p.slug)}.json`)
    .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
    .then(d => { const intro = (d.intro || '').trim(); body.innerHTML = ((intro && !intro.startsWith('<') ? `<p>${intro}</p>` : intro) + (d.html || '')).replaceAll('UPLOADS/', UI.UP) || '<p>Текст статьи скоро появится.</p>'; UI.fixLinks(body); })
    .catch(() => { body.innerHTML = '<p>Не удалось загрузить статью. Обновите страницу.</p>'; });
})();
