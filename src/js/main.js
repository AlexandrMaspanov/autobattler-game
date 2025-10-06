// src/js/main.js

import { Character } from './Character.js';
import { Monster } from './Monster.js';
import { Battle } from './Battle.js';

const startButton = document.getElementById('start-button');
const attackButton = document.getElementById('attack-button');
const nextButton = document.getElementById('next-button');

let player;
let monster;
let battle;

startButton.addEventListener('click', () => {
  player = new Character('Игрок');
  monster = new Monster('Монстр');
  battle = new Battle(player, monster);

  player.renderTo('.game__player');
  monster.renderTo('.game__monster');

  attackButton.disabled = false;
  startButton.disabled = true;
});

attackButton.addEventListener('click', () => {
  battle.attack();
});

nextButton.addEventListener('click', () => {
  monster = new Monster('Монстр');
  battle = new Battle(player, monster);
  monster.renderTo('.game__monster');
});
