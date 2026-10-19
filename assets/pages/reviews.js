// Отзывы: reviews.html (?master=43) — отзывы со страниц мастеров
(() => {
  const { e, head, tabs, param } = UI;
  const app = document.getElementById('app');
  const PAGE = 18;
  const all = MASTERS.flatMap(m => (MASTER_DETAILS[m.id]?.reviews || []).map(r => ({ ...r, m })));
  const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const toTime = s => { const [d, mon, y] = s.toLowerCase().split(' '); const m = MONTHS.findIndex(x => mon?.startsWith(x.slice(0, 3))); return new Date(+y, m, +d).getTime() || 0; };
  all.sort((a, b) => toTime(b.date) - toTime(a.date));
  const total = MASTERS.reduce((n, m) => n + (MASTER_DETAILS[m.id]?.reviewsCount || 0), 0);
  let master = MASTERS.some(m => m.id == param('master')) ? param('master') : 'all';
  let shown = PAGE;

  app.innerHTML = `
    ${head({ title: 'Отзывы', crumbs: [['О Colba', 'about.html'], ['Отзывы']],
      lead: `Более ${total.toLocaleString('ru-RU')} отзывов гостей о наших мастерах. Спасибо, что делитесь впечатлениями!`,
      extra: '<div class="page-head__actions"><button class="btn" type="button" data-review="">Оставить отзыв</button></div><div data-tabs></div>' })}
    <section class="block block--tight"><div class="reviews-grid" data-list></div><div class="load-more" data-more></div></section>`;

  const list = app.querySelector('[data-list]'), more = app.querySelector('[data-more]');
  const withReviews = MASTERS.filter(m => MASTER_DETAILS[m.id]?.reviews?.length);
  tabs(app.querySelector('[data-tabs]'), [{ v: 'all', l: 'Все мастера' }, ...withReviews.map(m => ({ v: String(m.id), l: m.name }))], master, v => {
    master = v; shown = PAGE;
    const u = new URL(location); v === 'all' ? u.searchParams.delete('master') : u.searchParams.set('master', v); history.replaceState(null, '', u);
    render();
  });
  function render() {
    const items = all.filter(r => master === 'all' || r.m.id == master);
    list.innerHTML = items.slice(0, shown).map(r => `
      <article class="review">
        <header><h3>${e(r.author)}</h3>${starsHTML(r.rating || 5)}</header>
        <p>${e(r.text)}</p>
        <footer style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">
          <span class="review__master">Мастер: <a href="master.html?id=${r.m.id}">${e(r.m.name)}</a></span><time>${e(r.date)}</time>
        </footer>
      </article>`).join('') || '<p class="empty">Отзывов пока нет.</p>';
    more.innerHTML = items.length > shown ? '<button class="btn btn--ghost" type="button">Показать ещё</button>' : '';
  }
  more.addEventListener('click', () => { shown += PAGE; render(); });
  render();
})();
