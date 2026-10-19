// Общие компоненты страниц команды и мастера.
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const masterUrl = m => `master.html?id=${m.id}`;

const ICON_STAR = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 .8l2.2 4.6 5 .6-3.7 3.5.9 5L8 12.1 3.6 14.5l.9-5L.8 6l5-.6z"/></svg>';

function photoHTML(m, { eager = false } = {}) {
  return `
    <div class="photo">
      <img src="${esc(m.photo)}" alt="${esc(m.name)}" ${m.face ? `data-face="${m.face.join(',')}"` : ''}
        ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
    </div>`;
}

// Кадрирование по лицу. Рамка .photo всегда 3:4, поэтому кадр считается один раз
// в процентах и не зависит от размера карточки на экране.
const FRAME = { w: 3, h: 4 };
const FACE_SIZE = 0.3;   // лицо занимает ~30% высоты кадра (если фото позволяет)
const FACE_Y = 0.4;      // центр лица — на 40% высоты кадра: над головой остаётся воздух
const MAX_ZOOM = 2.2;    // сильнее не увеличиваем — фото начнёт «мылиться»

function fitPhoto(img) {
  if (!img.dataset.face || !img.naturalWidth) return;
  const [cx, cy, fh] = img.dataset.face.split(',').map(Number);
  const r = img.naturalHeight / img.naturalWidth;           // фото шириной 1, высотой r
  const { w: W, h: H } = FRAME;
  const cover = Math.max(W, H / r);                          // минимальный масштаб без пустот
  const wanted = Math.max(
    FACE_SIZE * H / (fh * r),                                // лицо нужного размера
    W / 2 / cx, W / 2 / (1 - cx),                            // лицо можно поставить по центру
  );
  const s = Math.min(Math.max(wanted, cover), cover * MAX_ZOOM);
  const clamp = (v, min) => Math.min(0, Math.max(min, v));
  const x = clamp(W / 2 - cx * s, W - s);
  const y = clamp(FACE_Y * H - cy * s * r, H - s * r);
  Object.assign(img.style, {
    width: `${s / W * 100}%`, left: `${x / W * 100}%`, top: `${y / H * 100}%`,
    transformOrigin: `${cx * 100}% ${cy * 100}%`,
  });
  img.classList.add('is-fit');
}

// Ловим загрузку любых фото на странице (в т.ч. отрисованных позже)
document.addEventListener('load', e => { if (e.target.tagName === 'IMG') fitPhoto(e.target); }, true);
const fitAll = root => root.querySelectorAll('img[data-face]').forEach(i => i.complete && fitPhoto(i));

function cardHTML(m) {
  return `
    <a class="master-card" href="${masterUrl(m)}">
      ${photoHTML(m)}
      <div class="master-card__body">
        <p class="master-card__name">${esc(m.name)}</p>
        <p class="master-card__role">${esc(m.role)}</p>
      </div>
    </a>`;
}

const starsHTML = (n = 5) => `<span class="stars" role="img" aria-label="Оценка ${n} из 5">${ICON_STAR.repeat(n)}</span>`;

function plural(n, one, few, many) {
  const a = n % 10, b = n % 100;
  if (a === 1 && b !== 11) return one;
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
  return many;
}
