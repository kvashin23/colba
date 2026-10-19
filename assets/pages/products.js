// Каталог косметики: products.html (?brand=slug)
(() => {
  const { e, head, tabs, param, img, rub } = UI;
  const app = document.getElementById('app');
  const PAGE = 16;
  let brand = PRODUCT_BRANDS.some(b => b.slug === param('brand')) ? param('brand') : 'all';
  let shown = PAGE;
  app.innerHTML = `
    ${head({ title: 'Каталог<br>косметики', crumbs: [['О Colba', 'about.html'], ['Каталог косметики']], lead: 'Профессиональная косметика, которой работают наши мастера. Актуальную цену и наличие уточните у администратора — отложим средство до вашего визита.', extra: '<div data-tabs></div>' })}
    <section class="block block--tight"><div class="cards products" data-list></div><div class="load-more" data-more></div></section>`;
  const list = app.querySelector('[data-list]'), more = app.querySelector('[data-more]');
  const n = b => PRODUCTS.filter(p => b === 'all' || p.brand === b).length;
  tabs(app.querySelector('[data-tabs]'), [{ v: 'all', l: 'Все бренды', n: PRODUCTS.length }, ...PRODUCT_BRANDS.map(b => ({ v: b.slug, l: b.title, n: n(b.slug) }))], brand, v => {
    brand = v; shown = PAGE;
    const u = new URL(location); v === 'all' ? u.searchParams.delete('brand') : u.searchParams.set('brand', v); history.replaceState(null, '', u);
    render();
  });
  function render() {
    const items = PRODUCTS.filter(p => brand === 'all' || p.brand === brand);
    list.innerHTML = items.slice(0, shown).map(productCard).join('');
    more.innerHTML = items.length > shown ? '<button class="btn btn--ghost" type="button">Показать ещё</button>' : '';
  }
  more.addEventListener('click', () => { shown += PAGE; render(); });
  render();
})();
