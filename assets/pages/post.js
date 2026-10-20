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
  const similar = BLOG.filter(x => x !== p && x.cats.some(c => p.cats.includes(c))).slice(0, 3);
  const prev = BLOG[i + 1], next = BLOG[i - 1];

  app.innerHTML = `
    ${crumbs([['Блог', 'blog.html'], [p.title]])}
    <article class="split">
      <div class="panel">
        <div class="anchors" style="margin:0 0 20px">${p.cats.map(c => `<a href="blog.html?cat=${c}">${LABELS[c] || c}</a>`).join('')}</div>
        <p class="card__meta" style="margin:0 0 10px">${e(p.date)}</p>
        <h1 class="h-section" style="font-size:clamp(26px,3.2vw,44px);margin:0 0 28px">${e(p.title)}</h1>
        <div class="media-cover" style="aspect-ratio:16/9;margin-bottom:32px"><img src="${img(p.img)}" alt=""></div>
        <div class="prose" data-body><p style="color:var(--ink-soft)">Загружаем статью…</p></div>
        <nav class="post-nav">
          ${prev ? `<a href="post.html?id=${e(prev.slug)}"><small>← Предыдущая</small>${e(prev.title)}</a>` : '<span></span>'}
          ${next ? `<a href="post.html?id=${e(next.slug)}" style="text-align:right"><small>Следующая →</small>${e(next.title)}</a>` : '<span></span>'}
        </nav>
      </div>
      <aside class="panel sticky">
        ${UI.leadForm({ title: 'Нужна консультация колориста?', text: 'Оставьте телефон — подберём мастера и время, ответим на вопросы по статье.', button: 'Жду звонка' })}
      </aside>
    </article>
    ${similar.length ? `
    <section class="block" aria-labelledby="sim-h">
      <div class="block__head"><h2 class="h-section" id="sim-h">Читайте также</h2><a class="link-more" href="blog.html">Все статьи</a></div>
      <div class="cards">${similar.map(card).join('')}</div>
    </section>` : ''}`;

  const body = app.querySelector('[data-body]');
  fetch(`assets/data/blog/${encodeURIComponent(p.slug)}.json`)
    .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
    .then(d => { const intro = (d.intro || '').trim(); body.innerHTML = ((intro && !intro.startsWith('<') ? `<p>${intro}</p>` : intro) + (d.html || '')).replaceAll('UPLOADS/', UI.UP) || '<p>Текст статьи скоро появится.</p>'; UI.fixLinks(body); })
    .catch(() => { body.innerHTML = '<p>Не удалось загрузить статью. Обновите страницу.</p>'; });
})();
