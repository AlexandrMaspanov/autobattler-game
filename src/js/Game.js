// src/js/Game.js

import { Character } from './Character.js';
import { Monster } from './Monster.js';
import { Battle } from './Battle.js';
import { monsterTable } from '../data/monsters.js';

export class Game {
  constructor(name, className) {
    this.character = new Character(name, className);
    this.monsterNames = Object.keys(monsterTable);
    this.monster = null;
    this.battle = null;
    this.log = [];
  }

  startNewBattle() {
    const randomIndex = Math.floor(Math.random() * this.monsterNames.length);
    const monsterName = this.monsterNames[randomIndex];
    this.monster = new Monster(monsterName);
    this.battle = new Battle(this.character, this.monster);
    this.log = [`Бой начинается: ${this.character.name} против ${monsterName}`];
  }

  nextTurn() {
    if (!this.battle) return;
    const status = this.battle.nextTurn();
    this.log.push(...this.battle.getLog());
    this.battle.log = []; // очищаем внутренний лог после передачи
    return status;
  }

  getCharacter() {
    return this.character;
  }

  getMonster() {
    return this.monster;
  }

  getLog() {
    return this.log;
  }
}
