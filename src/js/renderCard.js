export function renderCard(containerSelector, title, stats) {
  const container = document.querySelector(containerSelector);
  container.innerHTML = `
        <h2 class="character-card__title">${title}</h2>
        <div class="character-card__stats">
            ${stats
              .map((line) => `<p class="character-card__stat">${line}</p>`)
              .join('')}
        </div>
    `;
}
