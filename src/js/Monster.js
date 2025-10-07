// src/js/Monster.js

import { monsterTable } from '../data/monsters.js';
import { weaponTable } from '../data/weapons.js';

export class Monster {
  constructor(name) {
    const data = monsterTable[name];
    if (!data) throw new Error(`Неизвестный монстр: ${name}`);

    this.name = name;
    this.health = data.health;
    this.weapon = data.weapon;
    this.strength = data.strength;
    this.agility = data.agility;
    this.endurance = data.endurance;
    this.trait = data.trait;
    this.reward = data.reward;
  }

  getWeaponDamage() {
    const weapon = weaponTable[this.weapon];
    return weapon.damage + this.strength;
  }

  getWeaponType() {
    return weaponTable[this.weapon].type;
  }

  renderTo(selector) {
    const container = document.querySelector(selector);
    container.innerHTML = `
      <h2 class="monster-card__title">${this.name}</h2>
      <div class="monster-card__stats">
        <p class="monster-card__stat">Здоровье: ${this.health}</p>
        <p class="monster-card__stat">Оружие: ${
          this.weapon
        } (${this.getWeaponType()}, урон ${this.getWeaponDamage()})</p>
        <p class="monster-card__stat">Сила: ${this.strength}, Ловкость: ${
      this.agility
    }, Выносливость: ${this.endurance}</p>
        <p class="monster-card__stat">Особенность: ${this.trait}</p>
      </div>
    `;
  }
}
