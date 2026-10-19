// Карточка товара: product.html?id=57
(() => {
  const { e, param, img, rub, crumbs } = UI;
  const app = document.getElementById('app');
  const p = PRODUCTS.find(x => x.id == param('id'));
  if (!p) {
    app.innerHTML = UI.head({ title: 'Товар не найден', crumbs: [['Каталог', 'products.html']], extra: '<div class="page-head__actions"><a class="btn" href="products.html">Весь каталог</a></div>' });
    return;
  }
  const brand = PRODUCT_BRANDS.find(b => b.slug === p.brand);
  document.title = `${p.title} — ${brand?.title || ''} в Colba Color Bar`;
  const same = PRODUCTS.filter(x => x.brand === p.brand && x !== p).slice(0, 4);

  app.innerHTML = `
    ${crumbs([['Каталог косметики', 'products.html'], [brand?.title || '', `products.html?brand=${p.brand}`], [p.title]])}
    <section class="split">
      <div class="panel product">
        <div class="product__img"><img src="${img(p.img)}" alt="${e(p.title)}"></div>
        <div>
          <p class="card__meta" style="margin:0 0 10px"><a href="products.html?brand=${p.brand}">${e(brand?.title || '')}</a></p>
          <h1 class="h-section" style="font-size:clamp(22px,2.6vw,34px);margin:0 0 16px">${e(p.title)}</h1>
          <div class="chips-info" style="margin:0 0 20px">${p.volume ? `<span class="chip-info" style="background:var(--bg)">${e(p.volume)}</span>` : ''}</div>
          <p class="product__price">${rub(p.price)}</p>
          <p class="price-note" style="margin:6px 0 24px">Актуальную цену уточните у администратора</p>
          <button class="btn" type="button" data-reserve>Зарезервировать</button>
        </div>
      </div>
      <aside class="panel prose" style="max-width:none">
        <h2 style="margin-top:0">Описание</h2>
        ${p.text || '<p>Подробнее о средстве расскажет мастер или администратор.</p>'}
      </aside>
    </section>
    ${same.length ? `
    <section class="block" aria-labelledby="same-h">
      <div class="block__head"><h2 class="h-section" id="same-h">Ещё ${e(brand?.title || '')}</h2><a class="link-more" href="products.html?brand=${p.brand}">Все средства бренда</a></div>
      <div class="cards products">${same.map(productCard).join('')}</div>
    </section>` : ''}`;

  app.querySelector('[data-reserve]').addEventListener('click', () => {
    UI.modal(UI.leadForm({ title: 'Зарезервировать', text: `«${e(p.title)}» — отложим средство до вашего визита. Администратор перезвонит и подтвердит наличие.`, button: 'Зарезервировать', success: 'Готово! Администратор свяжется с вами, чтобы подтвердить резерв.' }), { cls: 'modal__box--form' });
  });
})();
