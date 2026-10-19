// Общие шапка и подвал для всех страниц: <header class="site-header"></header> и <footer class="site-footer"></footer>
(() => {
  const SITE = 'https://colbacolorbar.ru';
  const page = location.pathname.split('/').pop().replace('.html', '') || 'index';

  // Меню: пункт с items — выпадающий список
  const NAV = [
    { title: 'Цены и услуги', href: 'index.html#home-services', items: [
      ['Окрашивание', `${SITE}/services/okrashivanie`],
      ['Стрижки и укладки', `${SITE}/services/strizhki-i-ukladki`],
      ['Уходы', `${SITE}/services/uhody`],
      ['Ногтевой сервис', `${SITE}/services/nogtevoj-servis`],
      ['Услуги визажиста', `${SITE}/services/uslugi-vizazhista`],
      ['Для мужчин', `${SITE}/services/dlya-muzhchin`],
      ['Все услуги и цены', `${SITE}/services`, true],
    ] },
    { title: 'Портфолио', href: 'index.html#works', items: [
      ['Фото работ', `${SITE}/gallery/photo`],
      ['Видео работ', `${SITE}/gallery/video`],
      ['Наши коллекции', `${SITE}/collections`],
    ] },
    { title: 'Акции', href: 'index.html#promotions', items: [
      ['Скидка 10% в День Рождения', `${SITE}/promotions/16`],
      ['Скидка 10% на первое посещение', `${SITE}/promotions/17`],
      ['День Колбы — скидка 15%', `${SITE}/promotions/12`],
      ['Подарочные сертификаты', `${SITE}/certificates/gift`],
      ['Все акции', `${SITE}/promotions`, true],
    ] },
    { title: 'Команда', href: 'teams.html', id: 'teams', items: [
      ['Колористы', 'teams.html?cat=stilist'],
      ['Визажисты', 'teams.html?cat=vizazhist'],
      ['Мастера ногтевого сервиса', 'teams.html?cat=mastera-nogtevogo-servisa'],
      ['Вся команда', 'teams.html', true],
    ] },
    { title: 'О Colba', href: `${SITE}/about`, items: [
      ['О салоне', `${SITE}/about`],
      ['Отзывы', `${SITE}/feedback`],
      ['Блог', `${SITE}/blogs`],
      ['Каталог косметики', `${SITE}/products`],
      ['Тест на образ', '#'],
      ['Правила', `${SITE}/rules`],
      ['Вакансии', `${SITE}/vacansies`],
      ['Франшиза', 'https://colbacolorbar-fr.ru/'],
    ] },
    { title: 'Контакты', href: 'index.html#contacts' },
  ];

  const chevron = '<svg class="nav__chevron" width="9" height="8" viewBox="0 0 9 8" aria-hidden="true"><path fill="currentColor" d="M6.19 7.06a1.95 1.95 0 0 1-3.38 0L.26 2.82C-.49 1.57.45 0 1.96 0h5.08c1.51 0 2.45 1.57 1.7 2.82z"/></svg>';
  const current = item => item.id === page || (page === 'master' && item.id === 'teams');

  const navHTML = NAV.map((item, i) => item.items ? `
    <div class="nav__item nav__item--drop${current(item) ? ' is-current' : ''}">
      <a class="nav__link" href="${item.href}" aria-haspopup="true" aria-expanded="false" aria-controls="dd${i}">${item.title}${chevron}</a>
      <div class="nav__dropdown" id="dd${i}">
        ${item.items.map(([t, h, all]) => `<a href="${h}"${all ? ' class="is-all"' : ''}>${t}</a>`).join('')}
      </div>
    </div>` : `
    <div class="nav__item"><a class="nav__link" href="${item.href}">${item.title}</a></div>`).join('');

  const header = document.querySelector('.site-header');
  header.innerHTML = `
    <a class="logo" href="index.html">COL<sup>or</sup>BA</a>
    <nav class="site-nav" aria-label="Основное меню" id="siteNav">
      ${navHTML}
      <div class="nav__item"><a class="nav__link is-strong" href="#">Запись</a></div>
    </nav>
    <a class="site-phone" href="tel:+74991102210">8 499 110-22-10</a>
    <button class="burger" type="button" aria-label="Меню" aria-expanded="false" aria-controls="siteNav"><span></span><span></span></button>`;

  // Мобильное меню: бургер раскрывает панель, пункты с подменю раскрываются по тапу
  const burger = header.querySelector('.burger');
  burger.addEventListener('click', () => {
    const open = header.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
    document.body.classList.toggle('no-scroll', open);
  });
  header.querySelectorAll('.nav__item--drop > .nav__link').forEach(link => {
    link.addEventListener('click', e => {
      if (!header.classList.contains('is-open')) return;   // на десктопе — обычная ссылка
      e.preventDefault();
      const item = link.parentElement;
      const open = item.classList.toggle('is-expanded');
      link.setAttribute('aria-expanded', open);
    });
  });
  header.querySelectorAll('.nav__dropdown a, .nav__item:not(.nav__item--drop) a').forEach(a =>
    a.addEventListener('click', () => { header.classList.remove('is-open'); document.body.classList.remove('no-scroll'); }));

  // ---------- Подвал ----------
  const FOOT_NAV = [
    ['Услуги', [
      ['Окрашивание', `${SITE}/services/okrashivanie`], ['Стрижки и укладки', `${SITE}/services/strizhki-i-ukladki`],
      ['Уходы', `${SITE}/services/uhody`], ['Ногтевой сервис', `${SITE}/services/nogtevoj-servis`],
      ['Услуги визажиста', `${SITE}/services/uslugi-vizazhista`], ['Для мужчин', `${SITE}/services/dlya-muzhchin`],
    ]],
    ['Салон', [
      ['О Colba', `${SITE}/about`], ['Команда', 'teams.html'], ['Акции', `${SITE}/promotions`],
      ['Галерея работ', `${SITE}/gallery/photo`], ['Тест на образ', '#'], ['Блог', `${SITE}/blogs`],
    ]],
    ['Покупателям', [
      ['Каталог косметики', `${SITE}/products`], ['Подарочные сертификаты', `${SITE}/certificates/gift`],
      ['Наши коллекции', `${SITE}/collections`], ['Правила', `${SITE}/rules`], ['Вакансии', `${SITE}/vacansies`],
    ]],
  ];
  const SOCIAL = [
    ['Instagram', 'https://instagram.com/colbacolorbar', '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/>'],
    ['Facebook', 'https://www.facebook.com/colba/', '<path fill="currentColor" d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21z"/>'],
    ['ВКонтакте', 'https://vk.com/colbacolorbar', '<path fill="currentColor" d="M12.8 17.5C6.9 17.5 3.5 13.5 3.4 6.8h3c.1 4.9 2.2 7 3.9 7.4V6.8H13v4.2c1.7-.2 3.4-2.1 4-4.2h2.8c-.5 2.6-2.4 4.5-3.7 5.3 1.3.6 3.5 2.3 4.3 5.4h-3.1c-.7-2.1-2.3-3.7-4.3-3.9v3.9z"/>'],
    ['Telegram', 'https://t.me/colbacolorbar', '<path fill="currentColor" d="M20.7 4.3 2.9 11.2c-1.2.5-1.2 1.2-.2 1.5l4.6 1.4 1.7 5.4c.2.6.4.8.9.8.4 0 .6-.2.9-.4l2.2-2.1 4.6 3.4c.8.5 1.4.2 1.6-.8l3-14.1c.3-1.2-.5-1.8-1.5-1.3zM8.2 13.9l9.6-6.1c.5-.3.9-.1.5.2l-8.2 7.4-.3 3.4z"/>'],
    ['YouTube', 'https://www.youtube.com/channel/UCb5yDMXwH9XasvpZRR2n1kA', '<path fill="currentColor" d="M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8c.2.9.9 1.6 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3z"/>'],
  ];
  const PARTNERS = ['advante.png', 'kevin_murphy.svg', 'la_biosthetique.svg', 'lebel.svg', 'davines.png', 'nashi_argan.png'];
  const IMG = `${SITE}/themes/colba-redesign/assets/images`;

  const footer = document.querySelector('.site-footer');
  footer.innerHTML = `
    <div class="foot__top">
      <div class="foot__contacts">
        <a class="logo logo--light" href="index.html">COL<sup>or</sup>BA</a>
        <p class="foot__addr">Москва, м. Пушкинская,<br>Б. Гнездниковский пер., 10</p>
        <p class="foot__hours">Пн–Вс 10:00–22:00</p>
        <div class="foot__phones">
          <a href="tel:+74991102210">8 499 110-22-10</a>
          <a href="tel:+79260220366">8 926 022-03-66</a>
          <a class="foot__mail" href="mailto:info@colbacolorbar.ru">info@colbacolorbar.ru</a>
        </div>
      </div>
      ${FOOT_NAV.map(([title, links]) => `
        <nav class="foot__col" aria-label="${title}">
          <h3>${title}</h3>
          ${links.map(([t, h]) => `<a href="${h}">${t}</a>`).join('')}
        </nav>`).join('')}
    </div>

    <details class="foot__route">
      <summary>Схема проезда</summary>
      <p>Ближайший выход — м. Пушкинская, первый вагон из центра, после эскалатора выход через турникет налево, далее в стеклянные двери и налево в длинный переход, дойти до конца перехода и повернуть направо, далее выход по лестнице налево на Тверскую и повернуть направо. Поворот в первую арку — Большой Гнездниковский переулок, первый дом слева — № 10.</p>
    </details>

    <div class="foot__mid">
      <div class="foot__social">
        ${SOCIAL.map(([name, href, icon]) => `<a href="${href}" target="_blank" rel="noopener" aria-label="${name}"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">${icon}</svg></a>`).join('')}
      </div>
      <div class="foot__apps">
        <a href="https://apps.apple.com/us/app/colba-color-bar/id1238859538" target="_blank" rel="noopener">App Store</a>
        <a href="https://play.google.com/store/apps/details?id=com.yclients.widget.s32762" target="_blank" rel="noopener">Google Play</a>
      </div>
    </div>

    <div class="foot__partners">
      <div class="foot__group">
        <span>Наш проект</span>
        <a href="http://supermancut.ru/" target="_blank" rel="noopener"><img src="${IMG}/projects/superman.png" alt="Супермен" loading="lazy"></a>
      </div>
      <div class="foot__group">
        <span>Наши партнёры</span>
        ${PARTNERS.map(p => `<img src="${IMG}/partners/${p}" alt="" loading="lazy">`).join('')}
      </div>
    </div>

    <div class="foot__legal">
      <span>ООО «Колба» · ИНН 9710004510 · ОГРН 5157746080950</span>
      <span>© ${new Date().getFullYear()} Все права защищены</span>
      <a href="${SITE}/policy">Политика конфиденциальности</a>
      <a href="${SITE}/rules">Правила посещения салона</a>
    </div>`;
})();
