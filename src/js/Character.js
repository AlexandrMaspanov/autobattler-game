// src/js/Character.js

import { classHealthPerLevel, classStartingWeapon } from '../data/classes.js';
import { weaponTable } from '../data/weapons.js';

export class Character {
  constructor(name, chosenClass) {
    if (
      !classHealthPerLevel[chosenClass] ||
      !classStartingWeapon[chosenClass]
    ) {
      throw new Error(`Недопустимый класс: ${chosenClass}`);
    }

    this.name = name;
    this.level = 1;
    this.levels = [{ class: chosenClass, level: 1 }];
    this.attributes = this.generateAttributes();
    this.weapon = classStartingWeapon[chosenClass];
    this.health = this.calculateMaxHealth();
    this.victories = 0;
  }

  generateAttributes() {
    return {
      strength: Math.floor(Math.random() * 3) + 1,
      agility: Math.floor(Math.random() * 3) + 1,
      endurance: Math.floor(Math.random() * 3) + 1,
    };
  }

  calculateMaxHealth() {
    let total = 0;
    for (const entry of this.levels) {
      const base = classHealthPerLevel[entry.class];
      total += base * entry.level;
    }
    total += this.attributes.endurance * this.level;
    return total;
  }

  getWeaponDamage() {
    const weapon = weaponTable[this.weapon];
    return weapon.damage + this.attributes.strength;
  }

  getWeaponType() {
    return weaponTable[this.weapon].type;
  }

  getActiveBonuses() {
    const bonuses = [];

    for (const entry of this.levels) {
      const { class: cls, level } = entry;

      if (cls === 'Разбойник') {
        if (level >= 1) bonuses.push('Скрытая атака');
        if (level >= 2) bonuses.push('Ловкость +1');
        if (level >= 3) bonuses.push('Яд');
      }

      if (cls === 'Воин') {
        if (level >= 1) bonuses.push('Порыв к действию');
        if (level >= 2) bonuses.push('Щит');
        if (level >= 3) bonuses.push('Сила +1');
      }

      if (cls === 'Варвар') {
        if (level >= 1) bonuses.push('Ярость');
        if (level >= 2) bonuses.push('Каменная кожа');
        if (level >= 3) bonuses.push('Выносливость +1');
      }
    }

    return bonuses;
  }

  addLevel(newClass) {
    const existing = this.levels.find((entry) => entry.class === newClass);
    if (existing) {
      existing.level += 1;
    } else {
      this.levels.push({ class: newClass, level: 1 });
    }

    this.level += 1;
    this.health = this.calculateMaxHealth();
  }

  renderTo(selector) {
    const container = document.querySelector(selector);
    const bonuses = this.getActiveBonuses();

    container.innerHTML = `
      <h2 class="character-card__title">${this.name}</h2>
      <div class="character-card__stats">
        <p class="character-card__stat">Уровень: ${this.level}</p>
        <p class="character-card__stat">Классы: ${this.levels
          .map((e) => `${e.class} ${e.level}`)
          .join(', ')}</p>
        <p class="character-card__stat">Здоровье: ${this.health}</p>
        <p class="character-card__stat">Оружие: ${
          this.weapon
        } (${this.getWeaponType()}, урон ${this.getWeaponDamage()})</p>
        <p class="character-card__stat">
          Атрибуты: Сила ${this.attributes.strength}, Ловкость ${
      this.attributes.agility
    }, Выносливость ${this.attributes.endurance}
        </p>
        <p class="character-card__stat">Бонусы: ${bonuses.join(', ') || '—'}</p>
      </div>
    `;
  }
}
