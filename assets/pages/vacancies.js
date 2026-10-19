// Вакансии: vacancies.html (тексты — с colbacolorbar.ru/vacansies)
(() => {
  const { head, field, consent } = UI;
  const exp = ['От 1 года', '1–3 лет', 'Больше 3 лет'];
  document.getElementById('app').innerHTML = `
    ${head({ title: 'Присоединяйся<br>к команде Колба!', crumbs: [['О Colba', 'about.html'], ['Вакансии']],
      lead: 'Мы ищем талантливых колористов и мастеров, которые хотят расти и развиваться вместе с нами.',
      extra: '<div class="page-head__actions"><a class="btn" href="#apply">Откликнуться</a></div>' })}

    <section class="block" aria-labelledby="who-h">
      <div class="block__head"><h2 class="h-section" id="who-h">Кого мы ждём</h2></div>
      <div class="facts-grid" style="--cols:4">
        <div class="fact"><h3>Желание расти</h3><p>Мастеров, которые хотят реализовываться профессионально и развиваться.</p></div>
        <div class="fact"><h3>Любовь к делу</h3><p>С любовью к своей профессии и к гостям.</p></div>
        <div class="fact"><h3>Инициатива</h3><p>Активных и инициативных.</p></div>
        <div class="fact"><h3>Команда</h3><p>Командных и ответственных.</p></div>
      </div>
    </section>

    <section class="block split" id="apply">
      <div class="page-head" style="min-height:100%">
        <p class="cat-card__letter" style="font-size:clamp(48px,6vw,96px);opacity:1;margin:0">24 000</p>
        <p class="page-head__lead" style="margin-top:8px">счастливых образов уже создала команда Колба.</p>
        <p class="page-head__lead">Возможно, именно с этой заявки начнётся ваша новая профессиональная глава в Колбе ;)</p>
      </div>
      <form class="panel lead-form" data-demo="Спасибо! Мы изучим портфолио и свяжемся с вами." novalidate>
        <h2 class="h-section">Отклик на вакансию</h2>
        <div class="lead-form__fields">
          ${field('name', 'Имя', { placeholder: 'Как к вам обращаться' })}
          ${field('phone', 'Телефон', { type: 'tel', placeholder: '+7 (___) ___-__-__' })}
          <div class="field"><span class="field__label">Опыт работы</span>
            <div class="radio-row">${exp.map((x, i) => `<label><input type="radio" name="exp" value="${x}" ${i === 1 ? 'checked' : ''}><span>${x}</span></label>`).join('')}</div></div>
          ${field('portfolio', 'Ссылка на портфолио', { type: 'url', required: false, placeholder: 'https://' })}
          ${field('comment', 'Комментарий', { textarea: true, required: false })}
        </div>
        ${consent()}
        <button class="btn" type="submit">Отправить</button>
      </form>
    </section>`;
})();
