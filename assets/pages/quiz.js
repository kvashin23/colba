// Тест на образ: quiz.html — шаги и варианты с colbacolorbar.ru
(() => {
  const { e, field, consent, head } = UI;
  const U = 'https://colbacolorbar.ru/storage/app/uploads/public/';
  const STEPS = [
    { title: 'Выберите наиболее понравившиеся окрашивания', opts: [['Тонирование', '666/03e/12d/66603e12da383721836014.jpg'], ['Яркие цвета', '666/02d/59f/66602d59f2f30322806729.jpg'], ['Сложное окрашивание', '666/03c/ee6/66603cee64c04188515421.jpg'], ['Рельефное', '666/03d/9a1/66603d9a1df04380615744.jpeg']] },
    { title: 'Выберите наиболее понравившиеся оттенки волос', opts: [['Брюнет', '666/030/a71/666030a718f6d240269967.jpg'], ['Блонд', '666/030/4c5/6660304c52f1a555724815.jpg'], ['Рыжий', '666/032/07c/66603207cc596620466599.jpg'], ['Шатен', '666/031/cfa/666031cfa3d84786864949.jpg'], ['Русый', '666/030/e23/666030e231375950483708.jpg'], ['Яркие цвета', '666/031/845/6660318457137743372938.jpg']] },
    { title: 'Выберите текстуру волос, соответствующую вашей', opts: [['Кудрявые', '666/033/366/666033366c3e1287441651.jpg'], ['Прямые', '666/033/7fe/6660337fed494362017477.jpg'], ['Вьющиеся', '666/034/019/66603401976e7682970475.jpg']] },
    { title: 'Выберите ваши цвет и длину волос на данный момент', groups: [['Цвет', ['Окрашенные', 'Неокрашенные', 'Тонированные', 'Окрашенные с растяжкой блонда']], ['Длина', ['Короткие (до плеч)', 'Средняя длина (ниже плеч)', 'Длинные (ниже лопаток)']]] },
    { title: 'Выберите вашу частоту окрашивания волос', groups: [['', ['Чаще одного раза в месяц', 'Один раз в месяц', 'Один раз в два месяца', 'Один раз в полгода', 'Неокрашенные']]] },
    { title: 'Необходим ли уход вашим волосам?', groups: [['', ['Восстановление', 'Увлажнение', 'Повреждённые', 'Сильно повреждённые', 'Секущиеся кончики', 'Нет']]] },
    { title: 'Когда вы планируете окрасить волосы?', groups: [['', ['Срочно', 'В ближайшее свободное время', 'В течение двух недель', 'Не срочно']]] },
    { title: 'Какие дополнительные услуги вас интересуют?', groups: [['', ['Стрижка', 'Укладка', 'Коррекция и окрашивание бровей', 'Макияж', 'Маникюр', 'Педикюр', 'Только окрашивание']]] },
    { title: 'Укажите, пожалуйста, приемлемый для вас ценовой диапазон', groups: [['', ['От 7 000 ₽ до 12 000 ₽', 'От 12 000 ₽ до 18 000 ₽', 'От 18 000 ₽ до 25 000 ₽', 'Не имеет значения']]] },
  ];
  const app = document.getElementById('app');
  const answers = STEPS.map(() => new Set());
  let step = -1;   // -1 — стартовый экран, STEPS.length — контакты

  app.innerHTML = `${UI.crumbs([['О Colba', 'about.html'], ['Тест на образ']])}<section class="panel" data-quiz></section>`;
  const root = app.querySelector('[data-quiz]');
  const discount = () => Math.min(10, Math.max(0, step + 1));

  function render() {
    if (step < 0) {
      root.innerHTML = `<div class="quiz__start">
        <h1 class="h-display">Пройдите тест<br>и получите скидку 10%</h1>
        <p class="page-head__lead" style="margin:0">Ответьте на 9 коротких вопросов о ваших волосах и пожеланиях — мы предложим индивидуальную консультацию колориста и скидку 10%.</p>
        <button class="btn" type="button" data-next>Начать тест</button></div>`;
      return;
    }
    const last = step === STEPS.length;
    const bar = `<div class="quiz__bar"><div class="quiz__progress"><i style="width:${(step / STEPS.length) * 100}%"></i></div>
      <span class="quiz__discount">Скидка <b>${last ? 10 : discount()}%</b></span></div>`;
    if (last) {
      root.innerHTML = `<div class="quiz">${bar}
        <form class="lead-form" data-demo="Благодарим за прохождение нашего теста! Мы свяжемся с вами и пригласим на индивидуальную консультацию со скидкой 10%." novalidate>
          <h2 class="quiz__title">Укажите ваши имя и номер телефона</h2>
          <div class="lead-form__fields">${field('name', 'Имя')}${field('phone', 'Телефон', { type: 'tel', placeholder: '+7 (___) ___-__-__' })}</div>
          ${consent()}
          <div class="quiz__nav"><button class="btn btn--ghost" type="button" data-prev>Назад</button><button class="btn" type="submit">Получить скидку 10%</button></div>
        </form></div>`;
      return;
    }
    const s = STEPS[step], a = answers[step];
    const opt = (label, src) => `<label class="quiz__opt"><input type="checkbox" value="${e(label)}" ${a.has(label) ? 'checked' : ''}><span>${src ? `<img src="${U}${src}" alt="" loading="lazy">` : ''}<em>${e(label)}</em></span></label>`;
    root.innerHTML = `<div class="quiz">${bar}
      <h1 class="quiz__title">${e(s.title)}</h1><p class="quiz__hint">Можно выбрать несколько вариантов.</p>
      ${s.opts ? `<div class="quiz__options">${s.opts.map(([l, src]) => opt(l, src)).join('')}</div>`
        : `<div class="quiz__checks">${s.groups.map(([t, list]) => `<div>${t ? `<h3>${t}</h3>` : ''}<div class="radio-row">${list.map(l => `<label><input type="checkbox" value="${e(l)}" ${a.has(l) ? 'checked' : ''}><span>${e(l)}</span></label>`).join('')}</div></div>`).join('')}</div>`}
      <div class="quiz__nav"><button class="btn btn--ghost" type="button" data-prev>${step === 0 ? 'К началу' : 'Назад'}</button>
        <button class="btn" type="button" data-next ${a.size ? '' : 'disabled'}>Далее</button></div></div>`;
  }
  root.addEventListener('change', ev => {
    if (step < 0 || step >= STEPS.length || ev.target.type !== 'checkbox') return;
    ev.target.checked ? answers[step].add(ev.target.value) : answers[step].delete(ev.target.value);
    root.querySelector('[data-next]').disabled = !answers[step].size;
  });
  root.addEventListener('click', ev => {
    if (ev.target.closest('[data-next]')) { step++; render(); root.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    if (ev.target.closest('[data-prev]')) { step--; render(); }
  });
  render();
})();
