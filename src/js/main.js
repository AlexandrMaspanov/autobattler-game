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

  if (status === 'end') {
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
  logContainer.innerHTML = game
    .getLog()
    .map((line) => `<p>${line}</p>`)
    .join('');
}
