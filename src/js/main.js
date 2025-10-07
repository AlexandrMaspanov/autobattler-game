// src/js/main.js

import { Game } from './Game.js';

const startButton = document.getElementById('start-button');
const attackButton = document.getElementById('attack-button');
const nextButton = document.getElementById('next-button');
const logContainer = document.querySelector('.game__log');

const nameInput = document.getElementById('name-input');
const classSelect = document.getElementById('class-select');

let game;

startButton.addEventListener('click', () => {
  const name = nameInput.value || 'Игрок';
  const className = classSelect.value || 'Воин';

  game = new Game(name, className);
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
    startButton.disabled = false;

    document.querySelector('.game__monster').innerHTML = '';

    const logList = document.querySelector('.game__log-list');
    const li = document.createElement('li');
    li.textContent = 'Вы проиграли. Начните заново.';
    logList.appendChild(li);
  } else if (status === 'end') {
    attackButton.disabled = true;
    nextButton.disabled = false;
  }
});

nextButton.addEventListener('click', () => {
  game.startNewBattle();
  game.getMonster().renderTo('.game__monster');
  renderLog();

  attackButton.disabled = false;
  nextButton.disabled = true;
});

function renderLog() {
  const logList = document.querySelector('.game__log-list');
  const newLines = game.getLog();
  newLines.forEach((line) => {
    const li = document.createElement('li');
    li.textContent = line;
    logList.appendChild(li);
  });
  game.log = []; // очищаем лог после вывода
}
