// Акции: promotions.html — список, promotions.html?id=16 — акция
const PROMOTIONS = [
  { id: 16, when: '7 дней до и 7 дней после Дня Рождения', title: 'День Рождения — скидка 10%', img: '5e5/d5c/aee/5e5d5caeec8a9469445391.jpg',
    text: '<p>Мы предоставляем скидку 10% на все услуги 7 дней до и 7 дней после вашего Дня Рождения!</p>' },
  { id: 17, when: 'Любой день', title: 'Скидка 10% на первое посещение', img: '5d0/201/505/5d0201505edd9264532986.jpg',
    text: '<p>Скидка 10% на первый визит в наш салон!</p>' },
  { id: 12, when: 'Каждое 14-е число месяца', title: 'День Колбы — скидка 15% на все виды окрашиваний и уходов', img: '5ca/f45/64a/5caf4564a8b0a781853659.jpg',
    text: '<p>Каждое 14-е число месяца — скидка 15% на все виды окрашиваний и уходов.</p><p>Специальные цены на стрижку при окрашивании в составе услуг — 6 200 ₽, а также на фирменный уход Magic — 7 400 / 8 200 ₽.</p><p>Не упустите возможность обновить свой образ!</p><p><em>*Скидка не распространяется на укладки.</em></p>' },
];

(() => {
  const { e, param, head, img } = UI;
  const app = document.getElementById('app');
  const card = p => `
    <a class="card" href="promotions.html?id=${p.id}">
      <div class="card__img"><img src="${img(p.img)}" alt="" loading="lazy"></div>
      <p class="card__meta">${e(p.when)}</p><h3>${e(p.title)}</h3>
    </a>`;
  const certificate = `
    <a class="card cert-card" href="certificates.html">
      <div class="card__img cert-visual"><img src="assets/img/site/page-certificate.webp" alt="" loading="lazy"></div>
      <p class="card__meta">Подарок</p><h3>Подарочный сертификат на услуги Colba</h3>
    </a>`;
  const p = PROMOTIONS.find(x => x.id == param('id'));

  if (!p) {
    app.innerHTML = `
      ${head({ title: 'Акции', crumbs: [['Акции']], lead: 'Специальные предложения салона Colba Color Bar.' })}
      <section class="block block--tight"><div class="cards" style="--cols:4">${PROMOTIONS.map(card).join('')}${certificate}</div></section>`;
    return;
  }

  document.title = `${p.title} — акция Colba Color Bar`;
  app.innerHTML = `
    ${UI.crumbs([['Акции', 'promotions.html'], [p.title]])}
    <section class="split">
      <div class="panel">
        <div class="media-cover" style="aspect-ratio:16/9;margin-bottom:28px"><img src="${img(p.img)}" alt=""></div>
        <span class="chip-info" style="background:var(--bg)">${e(p.when)}</span>
        <h1 class="h-section" style="margin:18px 0 20px;font-size:clamp(26px,3vw,40px)">${e(p.title)}</h1>
        <div class="prose">${p.text}</div>
      </div>
      <aside class="panel sticky">${UI.leadForm({ title: 'Записаться по акции', text: 'Оставьте телефон — администратор подберёт время и применит скидку.', button: 'Записаться' })}</aside>
    </section>
    <section class="block" aria-labelledby="more-h">
      <div class="block__head"><h2 class="h-section" id="more-h">Другие акции</h2><a class="link-more" href="promotions.html">Все акции</a></div>
      <div class="cards">${PROMOTIONS.filter(x => x !== p).map(card).join('')}${certificate}</div>
    </section>`;
})();
