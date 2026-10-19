// Подарочные сертификаты: certificates.html (тексты — с colbacolorbar.ru/certificates/gift)
(() => {
  const app = document.getElementById('app');
  const BUY = 'https://o4395.yclients.com/loyalty';   // покупка сертификата — через YCLIENTS, как на сайте
  app.innerHTML = `
    ${UI.crumbs([['Акции', 'promotions.html'], ['Подарочные сертификаты']])}
    <section class="split">
      <div class="page-head" style="min-height:100%">
        <h1 class="h-display" style="font-size:clamp(28px,4.4vw,60px)">Сертификат<br>на услуги Colba</h1>
        <p class="page-head__lead">Идеальная формула красоты — подарок, который порадует каждого.</p>
        <div class="page-head__actions"><a class="btn" href="${BUY}" target="_blank" rel="noopener">Выбрать сертификат</a><a class="btn btn--ghost" href="tel:+74991102210">Купить по телефону</a></div>
      </div>
      <div class="media-cover" style="aspect-ratio:1"><img src="https://colbacolorbar.ru/themes/colba-redesign/assets/images/page-certificate.webp" alt="Подарочный сертификат Colba"></div>
    </section>

    <section class="block" aria-labelledby="adv-h">
      <div class="block__head"><h2 class="h-section" id="adv-h">Преимущества сертификата</h2></div>
      <div class="facts-grid" style="--cols:4">
        <div class="fact"><h3>Подарок для всех</h3><p>Подходит для друзей, коллег и близких.</p></div>
        <div class="fact"><h3>Гибкий номинал</h3><p>Выбирайте нужную услугу и сумму.</p></div>
        <div class="fact"><h3>Уникальное оформление</h3><p>Чистый лабораторный дизайн и эстетика COLBA.</p></div>
        <div class="fact"><h3>Видимый результат</h3><p>Каждая процедура — продуманная реакция, создающая видимый результат.</p></div>
      </div>
    </section>

    <section class="block" aria-labelledby="why-h">
      <div class="block__head"><h2 class="h-section" id="why-h">Почему выбирают нас</h2></div>
      <div class="facts-grid" style="--cols:4">
        <div class="fact"><h3>Колористы-эксперты</h3><p>Мастера химии цвета с многолетним опытом.</p></div>
        <div class="fact"><h3>Индивидуальный подход</h3><p>Авторские формулы окрашивания и премиальные продукты.</p></div>
        <div class="fact"><h3>Творческий процесс</h3><p>Создаём образы по точной рецептуре, подчёркивающей индивидуальность.</p></div>
        <div class="fact"><h3>Атмосфера салона</h3><p>Визуальная эстетика, уют и забота, которые превращают визит в приятный ритуал.</p></div>
      </div>
    </section>

    <section class="block split">
      <div class="panel prose"><h2 style="margin-top:0">Как получить сертификат</h2>
        <ol><li>Выберите номинал или услугу онлайн — кнопка «Выбрать сертификат».</li><li>Или позвоните администратору: 8 499 110-22-10.</li></ol></div>
      <aside class="panel">${UI.leadForm({ title: 'Помочь с выбором?', text: 'Оставьте телефон — администратор подскажет номинал и оформит сертификат.', button: 'Жду звонка' })}</aside>
    </section>`;

})();
