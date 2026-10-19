// Контакты: contacts.html
document.getElementById('app').innerHTML = `
  ${UI.head({ title: 'Контакты', crumbs: [['Контакты']], lead: 'Москва, Большой Гнездниковский переулок, 10 — в минуте от Тверской и в пяти минутах от м. Пушкинская.' })}

  <section class="contacts" style="margin-top:18px" aria-label="Адрес и карта">
    <div class="contacts__info">
      <p class="contacts__addr" style="margin-top:0">Москва, Б. Гнездниковский пер., 10</p>
      <ul class="contacts__facts">
        <li><b>Пн–Вс</b> 10:00–22:00</li>
        <li><b>1 минута</b> пешком от Тверской</li>
        <li><b>5 минут</b> от м. Пушкинская</li>
      </ul>
      <div class="contacts__phones" style="margin-bottom:12px">
        <a class="contacts__phone" href="tel:+74991102210">8 499 110-22-10</a>
        <a class="contacts__phone" href="tel:+79260220366">8 926 022-03-66</a>
      </div>
      <p style="margin:0 0 24px"><a href="mailto:info@colbacolorbar.ru" class="link-more">info@colbacolorbar.ru</a></p>
      <div class="contacts__actions"><a class="btn" href="#book">Записаться онлайн</a></div>
    </div>
    <div class="contacts__map">
      <iframe src="https://yandex.ru/map-widget/v1/?ll=37.605697%2C55.763556&amp;z=16&amp;pt=37.605697%2C55.763556%2Cpm2rdl" title="Colba Color Bar на карте" loading="lazy" allowfullscreen></iframe>
      <a class="contacts__route-link" href="https://yandex.ru/maps/?rtext=~55.763556%2C37.605697&amp;rtt=auto" target="_blank" rel="noopener">Построить маршрут</a>
    </div>
  </section>

  <section class="block split">
    <div class="panel prose">
      <h2 style="margin-top:0">Схема проезда</h2>
      <ol>
        <li>Ближайший выход — м. Пушкинская, первый вагон из центра.</li>
        <li>После эскалатора — через турникет налево, далее в стеклянные двери и налево в длинный переход.</li>
        <li>Дойти до конца перехода и повернуть направо, далее выход по лестнице налево на Тверскую — и направо.</li>
        <li>Поворот в первую арку — Большой Гнездниковский переулок, первый дом слева — № 10.</li>
      </ol>
      <h2>Мы в соцсетях</h2>
      <p><a href="https://t.me/colbacolorbar" target="_blank" rel="noopener">Telegram</a> · <a href="https://vk.com/colbacolorbar" target="_blank" rel="noopener">ВКонтакте</a> · <a href="https://instagram.com/colbacolorbar" target="_blank" rel="noopener">Instagram</a> · <a href="https://www.youtube.com/channel/UCb5yDMXwH9XasvpZRR2n1kA" target="_blank" rel="noopener">YouTube</a></p>
    </div>
    <aside class="panel">${UI.leadForm({ title: 'Оставьте заявку', button: 'Записаться' })}</aside>
  </section>`;
