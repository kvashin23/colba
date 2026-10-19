// Политика конфиденциальности: policy.html
document.getElementById('app').innerHTML = `
  ${UI.head({ title: 'Политика<br>конфиденциальности', small: true, crumbs: [['Политика конфиденциальности']], lead: 'Порядок обработки персональных данных ООО «Колба».' })}
  <section class="block block--tight panel"><div class="prose prose--wide">${POLICY_HTML}</div></section>`;
