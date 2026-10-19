// Данные и отрисовка блоков главной (кроме первого экрана).

const SERVICES = {
  'Топ-8': [
    ['Тонирование волос в 1 тон', 13500, 'okrashivanie/tonirovanie-volos-v-1-ton'],
    ['Рельефное окрашивание', 25000, 'okrashivanie/relefnoe-okrashivanie'],
    ['Шатуш', 28500, 'okrashivanie/shatush'],
    ['Техника мягкого осветления / AirTouch', 28500, 'okrashivanie/airtouch'],
    ['Женская стрижка', 7900, 'strizhki-i-ukladki/zhenskaya-strizhka'],
    ['Уход Advante Salon Treatment', 11000, 'uhody/uhod-advante-salon-treatment'],
    ['Фитомолекулярный уход Leaf Flower', 12500, 'uhody/fitomolekulyarnyj-uhod-leaf-flower'],
    ['Дневной макияж', 5800, 'uslugi-vizazhista/dnevnoj-makiyazh'],
  ],
  'Окрашивание': [
    ['Окрашивание корней', 11500, 'okrashivanie/kornej-volos'],
    ['Стойкое окрашивание волос в 1 тон', 17500, 'okrashivanie/stojkoe-okrashivanie-volos-v-1-ton'],
    ['Блики у лица / Babylights', 16500, 'okrashivanie/bliki-babylights'],
    ['Рельефное окрашивание', 25000, 'okrashivanie/relefnoe-okrashivanie'],
    ['Блондирование / Total Blond', 25500, 'okrashivanie/total-blond'],
  ],
  'Уходы': [
    ['Уход Magic Colba', 10500, 'uhody/uhod-magic-colba'],
    ['Уход Advante Salon Treatment', 11000, 'uhody/uhod-advante-salon-treatment'],
    ['Фитомолекулярный уход Leaf Flower', 12500, 'uhody/fitomolekulyarnyj-uhod-leaf-flower'],
    ['Уход Tokio Inkarami', 14500, 'uhody/uhod-tokio-inkarami'],
  ],
  'Ногтевой сервис': [
    ['Комбинированный маникюр', 2900, 'nogtevoj-servis/kombinirovannyj-manikyur'],
    ['Покрытие ногтей гелем', 2200, 'nogtevoj-servis/gel-pokrytie'],
    ['Выравнивание ногтевой пластины', 900, 'nogtevoj-servis/vyravnivanie-nogtevoj-plastiny'],
    ['Укрепление ногтей гелем', 2700, 'nogtevoj-servis/ukreplenie-nogtej-gelem'],
    ['Комбинированный педикюр', 3700, 'nogtevoj-servis/kombinirovannyj-pedikyur'],
    ['СПА-уход для ног Colba', 2200, 'nogtevoj-servis/spa-uhod-dlya-nog-colba'],
  ],
  'Услуги визажиста': [
    ['Окрашивание бровей краской', 2000, 'uslugi-vizazhista/okrashivanie-brovej-kraskoj'],
    ['Коррекция бровей', 2200, 'uslugi-vizazhista/korrekciya-brovej'],
    ['Окрашивание бровей хной', 2700, 'uslugi-vizazhista/vosstanovlenie-brovej-hnoj'],
    ['Дневной макияж', 5800, 'uslugi-vizazhista/dnevnoj-makiyazh'],
    ['Вечерний макияж', 6800, 'uslugi-vizazhista/vechernij-makiyazh'],
    ['Счастье для бровей', 2500, 'uslugi-vizazhista/schaste-dlya-brovej'],
    ['Урок макияжа', 14000, 'uslugi-vizazhista/urok-makiyazha'],
  ],
};

const PROMOS = [
  { when: '7 дней до и 7 дней после Дня Рождения', title: 'День Рождения — скидка 10%', img: '5e5/d5c/aee/5e5d5caeec8a9469445391.jpg', id: 16 },
  { when: 'Любой день', title: 'Скидка 10% на первое посещение', img: '5d0/201/505/5d0201505edd9264532986.jpg', id: 17 },
  { when: 'Каждое 14-е число месяца', title: 'День Колбы — скидка 15% на все окрашивания и уходы', img: '5ca/f45/64a/5caf4564a8b0a781853659.jpg', id: 12 },
];

const WORKS = [
  '668/7db/301/6687db301a7d7003771591.jpg', '667/d31/978/667d3197802a5087619748.jpg',
  '68e/fc0/b3c/68efc0b3c82ea048569320.png', '69c/4e4/a7b/69c4e4a7b7a85059065863.jpg',
  '69a/1ba/f6d/69a1baf6d4fb5253507574.jpg', '68e/fc5/021/68efc50213c87333883996.jpg',
  '69b/d34/08e/69bd3408eecee191206321.jpg', '69a/1b9/89a/69a1b989a8335568722736.jpg',
  '68e/fc0/534/68efc05347d34242999891.png', '69c/d04/845/69cd0484518f3502180387.jpg',
  '68e/fc0/065/68efc006539c0177655079.png', '66c/5db/844/66c5db8441312693659615.jpg',
].map(p => UPLOADS + p);

const rub = n => n.toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽';

// Услуги: вкладки + прайс
(() => {
  const tabs = document.getElementById('serviceTabs');
  const list = document.getElementById('priceList');
  const names = Object.keys(SERVICES);
  tabs.innerHTML = names.map((n, i) =>
    `<button type="button" role="tab" aria-pressed="${i === 0}">${n} <small>${SERVICES[n].length}</small></button>`).join('');
  const show = name => {
    list.innerHTML = SERVICES[name].map(([title, price, slug]) => `
      <li><a href="service.html?id=${slug.split('/').pop()}">
        <span class="price-list__name">${esc(title)}</span>
        <span class="price-list__price">от ${rub(price)}</span>
      </a></li>`).join('');
  };
  tabs.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    tabs.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
    show(names[[...tabs.children].indexOf(b)]);
  });
  show(names[0]);
})();

// Акции
document.getElementById('promos').innerHTML = PROMOS.map(p => `
  <a class="promo" href="promotions.html?id=${p.id}">
    <div class="promo__img"><img src="${UPLOADS + p.img}" alt="" loading="lazy"></div>
    <span class="promo__when">${esc(p.when)}</span>
    <h3>${esc(p.title)}</h3>
  </a>`).join('');

// Мастера
document.getElementById('teamRail').innerHTML = MASTERS.map(cardHTML).join('');
fitAll(document.getElementById('teamRail'));

// Работы
document.getElementById('gallery').innerHTML = WORKS.map((src, i) =>
  `<a href="${src}" data-lightbox="home"><img src="${src}" alt="Работа салона ${i + 1}" loading="lazy"></a>`).join('');

// Карусель мастеров
document.querySelectorAll('.arrows').forEach(ctrl => {
  const rail = document.getElementById(ctrl.dataset.for);
  const [prev, next] = ctrl.querySelectorAll('button');
  const sync = () => {
    prev.disabled = rail.scrollLeft <= 2;
    next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
  };
  ctrl.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    rail.scrollBy({ left: b.dataset.dir * rail.clientWidth * 0.8, behavior: 'smooth' });
  });
  rail.addEventListener('scroll', sync, { passive: true });
  addEventListener('resize', sync); sync();
});
