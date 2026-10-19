// Правила посещения: rules.html — документы с colbacolorbar.ru/rules
(() => {
  const DOCS = 'https://colbacolorbar.ru/themes/colba-redesign/assets/docs/';
  const docs = [
    ['Правила посещения салона', 'Действующая редакция', 'Правила_посещения_салона_Колба_фикс.pdf'],
    ['Правила посещения салона в период с 14.12.2024 по 31.12.2024', 'Праздничный период', 'Правила_посещения_салона_Колба_с_14_12_2024_31_12_2024.pdf'],
  ];
  const icon = '<svg width="28" height="34" viewBox="0 0 28 34" aria-hidden="true"><path d="M3 1h15l9 9v21a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M18 1v9h9" fill="none" stroke="currentColor" stroke-width="1.6"/><text x="5" y="27" font-size="8" font-family="sans-serif" font-weight="700" fill="currentColor">PDF</text></svg>';
  document.getElementById('app').innerHTML = `
    ${UI.head({ title: 'Правила', crumbs: [['О Colba', 'about.html'], ['Правила']], lead: 'Правила посещения салона Colba Color Bar. Документы открываются в формате PDF.' })}
    <section class="block block--tight"><div class="docs">${docs.map(([t, sub, f]) => `
      <a class="doc" href="${DOCS}${encodeURIComponent(f)}" target="_blank" rel="noopener">
        <span class="doc__icon">${icon}</span>
        <span><b>${t}</b><small>${sub} · PDF</small></span>
        <span class="doc__go">Открыть</span>
      </a>`).join('')}</div></section>
    <section class="block split">
      <div class="panel prose"><h2 style="margin-top:0">Остались вопросы?</h2><p>Администратор расскажет о правилах записи, переноса и отмены визита.</p><p><a href="tel:+74991102210">8 499 110-22-10</a> · <a href="mailto:info@colbacolorbar.ru">info@colbacolorbar.ru</a></p></div>
      <aside class="panel">${UI.leadForm({ title: 'Задать вопрос', text: '', button: 'Перезвоните мне' })}</aside>
    </section>`;
})();
