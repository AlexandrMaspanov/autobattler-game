// src/js/Monster.js

import { monsterTable } from '../data/monsters.js';
import { weaponTable } from '../data/weapons.js';
import { renderCard } from './renderCard.js';

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
    const stats = [
      `Здоровье: ${this.health}`,
      `Оружие: ${this.weapon}
        (${this.getWeaponType()}, урон ${this.getWeaponDamage()})`,
      `Атрибуты: Сила ${this.strength}, Ловкость ${this.agility}, Выносливость ${this.endurance}`,
      `Особенность: ${this.trait}`,
    ];
    renderCard(selector, this.name, stats);
  }
}
