// src/js/main.js

import { Game } from './Game.js';

const startButton = document.getElementById('start-button');
const attackButton = document.getElementById('attack-button');
const nextButton = document.getElementById('next-button');
const logContainer = document.querySelector('.game__log');

const setupSection = document.querySelector('.game__setup');

const levelupSection = document.querySelector('.game__levelup');
const levelupSelect = document.getElementById('levelup-select');
const levelupButton = document.getElementById('levelup-button');

const nameInput = document.getElementById('name-input');
const classSelect = document.getElementById('class-select');

const restartSection = document.querySelector('.game__restart');
const restartButton = document.getElementById('restart-button');

let game;

startButton.addEventListener('click', () => {
  // Скрытие форм выбора класса персонажа
  setupSection.classList.add('game__setup--hidden');
  levelupSection.classList.add('game__levelup--hidden');
  restartSection.classList.add('game__restart--hidden');

  // Очистка классов визуального дизейбла
  document
    .querySelector('.game__monster')
    .classList.remove('character-card--inactive');

  // Очистка перед новым боем
  document.querySelector('.game__log-list').innerHTML = '';

  resetCharacterCards();

  attackButton.disabled = true;
  nextButton.disabled = true;

  // Запуск нового боя
  const name = nameInput.value || 'Игрок';
  const className = classSelect.value || 'Воин';

  game = new Game(name, className);
  game.getCharacter().victories = 0;
  game.startNewBattle();

  game.getCharacter().renderTo('.game__player');
  game.getMonster().renderTo('.game__monster');
  renderLog();

  attackButton.disabled = false;
  startButton.disabled = true;
});

attackButton.addEventListener('click', () => {
  const status = game.nextTurn();
  game.getCharacter().renderTo('.game__player');
  game.getMonster().renderTo('.game__monster');
  renderLog();

  if (game.getCharacter().health <= 0) {
    attackButton.disabled = true;
    nextButton.disabled = true;
    startButton.disabled = true;

    game = null;
    setupSection.classList.remove('game__setup--hidden');
    levelupSection.classList.add('game__levelup--hidden');

    classSelect.selectedIndex = 0;

    document
      .querySelector('.game__monster')
      .classList.add('character-card--inactive');

    const logList = document.querySelector('.game__log-list');
    const li = document.createElement('li');
    li.textContent = 'Вы проиграли. Начните заново.';
    logList.appendChild(li);

    setupSection.classList.add('game__setup--hidden');
    levelupSection.classList.add('game__levelup--hidden');
    restartSection.classList.remove('game__restart--hidden');
  } else if (status === 'end') {
    const character = game.getCharacter();

    if (character.victories >= 5) {
      const logList = document.querySelector('.game__log-list');
      const li = document.createElement('li');
      li.textContent = 'Поздравляем! Вы победили 5 монстров и прошли игру.';
      logList.appendChild(li);

      setupSection.classList.add('game__setup--hidden');
      levelupSection.classList.add('game__levelup--hidden');
      restartSection.classList.remove('game__restart--hidden');

      // Сброс игры
      game = null;

      // Показываем форму создания персонажа
      setupSection.classList.remove('game__setup--hidden');
      levelupSection.classList.add('game__levelup--hidden');

      // Сброс селектов
      classSelect.selectedIndex = 0;
      nameInput.value = '';

      // Обновляем карточки
      resetCharacterCards();

      // Блокируем кнопки
      startButton.disabled = false;
      attackButton.disabled = true;
      nextButton.disabled = true;

      restartSection.classList.remove('game__restart--hidden');

      return;
    }

    if (character.level < 3) {
      levelupSection.classList.remove('game__levelup--hidden');
    } else {
      levelupSection.classList.add('game__levelup--hidden');
      character.health = character.calculateMaxHealth();
      character.renderTo('.game__player');
      nextButton.disabled = false;
    }

    attackButton.disabled = true;
    nextButton.disabled = true;
  }
});

nextButton.addEventListener('click', () => {
  game.startNewBattle();

  game.getCharacter().health = game.getCharacter().calculateMaxHealth();
  game.getCharacter().renderTo('.game__player');

  game.getMonster().renderTo('.game__monster');
  renderLog();

  attackButton.disabled = false;
  nextButton.disabled = true;
});

levelupButton.addEventListener('click', () => {
  const chosenClass = levelupSelect.value;
  game.getCharacter().addLevel(chosenClass);
  game.getCharacter().health = game.getCharacter().calculateMaxHealth();
  game.getCharacter().renderTo('.game__player');

  levelupSection.classList.add('game__levelup--hidden');
  nextButton.disabled = false;
});

restartButton.addEventListener('click', () => {
  setupSection.classList.remove('game__setup--hidden');
  levelupSection.classList.add('game__levelup--hidden');
  restartSection.classList.add('game__restart--hidden');

  document.querySelector('.game__log-list').innerHTML = '';
  classSelect.selectedIndex = 0;
  nameInput.value = '';
  resetCharacterCards();

  startButton.disabled = false;
  attackButton.disabled = true;
  nextButton.disabled = true;
});

function resetCharacterCards() {
  document.querySelector('.game__player').innerHTML = `
    <h2 class="character-card__title">Игрок</h2>
    <div class="character-card__stats">
      <p class="character-card__stat">Класс: -</p>
      <p class="character-card__stat">Уровень: -</p>
      <p class="character-card__stat">Здоровье: -</p>
      <p class="character-card__stat">Оружие: -</p>
      <p class="character-card__stat">Атрибуты: -</p>
      <p class="character-card__stat">Способности: -</p>
    </div>
  `;

  document.querySelector('.game__monster').innerHTML = `
    <h2 class="character-card__title">Монстр</h2>
    <div class="character-card__stats">
      <p class="character-card__stat">Тип: -</p>
      <p class="character-card__stat">Уровень: -</p>
      <p class="character-card__stat">Здоровье: -</p>
      <p class="character-card__stat">Оружие: -</p>
      <p class="character-card__stat">Атрибуты: -</p>
      <p class="character-card__stat">Способности: -</p>
    </div>
  `;
}

function renderLog() {
  const logList = document.querySelector('.game__log-list');
  const newLines = game.getLog();
  newLines.forEach((line) => {
    const li = document.createElement('li');
    li.textContent = line;
    logList.appendChild(li);
  });
  game.log = []; // очищаем лог после вывода
  logContainer.scrollTop = logContainer.scrollHeight;
}
