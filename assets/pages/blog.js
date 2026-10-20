// Блог: blog.html (?cat=okrashivaniya)
const BLOG_LABELS = { okrashivaniya: 'Окрашивания', uhody: 'Уходы', ukladki: 'Укладки', makiyazh: 'Макияж', cvetotipirovanie: 'Цветотип', produkty: 'Продукты' };
const blogCard = p => `
  <a class="card" href="post.html?id=${UI.e(p.slug)}">
    <div class="card__img"><img src="${UI.img(p.img)}" alt="" loading="lazy"></div>
    <p class="card__meta">${UI.e(p.date)}</p><h3>${UI.e(p.title)}</h3>
  </a>`;

(() => {
  const { head, tabs, param } = UI;
  const app = document.getElementById('app');
  const PAGE = 12;
  let cat = BLOG_LABELS[param('cat')] ? param('cat') : 'all';
  let shown = PAGE;

  app.innerHTML = `
    ${head({ title: 'Блог', crumbs: [['О Colba', 'about.html'], ['Блог']], lead: 'Статьи колористов Colba об окрашивании, уходе, укладках и трендах.', extra: '<div data-tabs></div>' })}
    <section class="block block--tight"><div class="cards blog-cards" data-list></div><div class="load-more" data-more></div></section>`;

  const list = app.querySelector('[data-list]'), more = app.querySelector('[data-more]');
  const count = c => BLOG.filter(p => c === 'all' || p.cats.includes(c)).length;
  tabs(app.querySelector('[data-tabs]'), [{ v: 'all', l: 'Все статьи', n: BLOG.length }, ...Object.entries(BLOG_LABELS).map(([v, l]) => ({ v, l, n: count(v) }))], cat, v => {
    cat = v; shown = PAGE;
    const u = new URL(location); v === 'all' ? u.searchParams.delete('cat') : u.searchParams.set('cat', v); history.replaceState(null, '', u);
    render();
  });
  function render() {
    const items = BLOG.filter(p => cat === 'all' || p.cats.includes(cat));
    list.innerHTML = items.slice(0, shown).map(blogCard).join('');
    more.innerHTML = items.length > shown ? `<button class="btn btn--ghost" type="button">Показать ещё</button>` : '';
  }
  more.addEventListener('click', () => { shown += PAGE; render(); });
  render();
})();
