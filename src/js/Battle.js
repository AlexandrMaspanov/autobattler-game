// src/js/Battle.js

export class Battle {
  constructor(character, monster) {
    this.character = character;
    this.monster = monster;
    this.round = 1;
    this.turn =
      character.attributes.agility >= monster.agility ? 'character' : 'monster';
    this.log = [];
  }

  rollHit(attacker, defender) {
    const max = attacker.attributes.agility + defender.attributes.agility;
    const roll = Math.floor(Math.random() * max) + 1;
    return roll > defender.attributes.agility;
  }

  calculateBaseDamage(attacker) {
    return attacker.getWeaponDamage();
  }

  applyAttackerEffects(attacker, defender, baseDamage, isCharacter) {
    const bonuses = attacker.getActiveBonuses?.() || [];

    // Порыв к действию
    if (
      isCharacter &&
      bonuses.includes('Порыв к действию') &&
      this.round === 1
    ) {
      baseDamage *= 2;
      this.log.push(
        'Порыв к действию: в первый ход наносит двойной урон оружием'
      );
    }

    // Ярость
    if (isCharacter && bonuses.includes('Ярость')) {
      if (this.round <= 3) {
        baseDamage += 2;
        this.log.push('Ярость: +2 к урону в первые 3 хода');
      } else {
        baseDamage -= 1;
        this.log.push('Ярость: -1 к урону после 3-го хода');
      }
    }

    // Скрытая атака
    if (
      isCharacter &&
      bonuses.includes('Скрытая атака') &&
      attacker.attributes.agility > defender.attributes.agility
    ) {
      baseDamage += 1;
      this.log.push(
        'Скрытая атака: +1 к урону если ловкость персонажа выше ловкости цели'
      );
    }

    // Призрак
    if (
      !isCharacter &&
      attacker.name === 'Призрак' &&
      attacker.attributes.agility > defender.attributes.agility
    ) {
      baseDamage += 1;
      this.log.push('Призрак использует скрытую атаку: +1 к урону');
    }

    return baseDamage;
  }

  applyDefenderEffects(attacker, defender, baseDamage, isCharacter) {
    const bonuses = defender.getActiveBonuses?.() || [];
    const weaponType = attacker.getWeaponType();

    // Щит
    if (
      isCharacter &&
      bonuses.includes('Щит') &&
      defender.attributes.strength > attacker.attributes.strength
    ) {
      baseDamage -= 3;
      this.log.push(
        'Щит: -3 к получаемому урону если сила персонажа выше силы атакующего'
      );
    }

    // Каменная кожа
    if (isCharacter && bonuses.includes('Каменная кожа')) {
      baseDamage -= defender.attributes.endurance;
      this.log.push(
        `Каменная кожа: получаемый урон снижается на значение выносливости (${defender.attributes.endurance})`
      );
    }

    // Скелет
    if (defender.name === 'Скелет' && weaponType === 'Дробящий') {
      baseDamage *= 2;
      this.log.push(
        'Скелет получает вдвое больше урона, если его бьют дробящим оружием'
      );
    }

    // Слайм
    if (defender.name === 'Слайм' && weaponType === 'Рубящий') {
      baseDamage = 0;
      this.log.push('Рубящее оружие не наносит Слайму урона');
    }

    // Голем
    if (defender.name === 'Голем') {
      baseDamage -= defender.attributes.endurance;
      this.log.push(
        `Голем: получаемый урон снижается на значение выносливости (${defender.attributes.endurance})`
      );
    }

    return Math.max(0, baseDamage);
  }

  applyPoison(attacker, defender) {
    const bonuses = attacker.getActiveBonuses?.() || [];
    if (bonuses.includes('Яд')) {
      const poisonDamage = this.round - 1;
      defender.health -= poisonDamage;
      this.log.push(`Яд: наносит дополнительный урон ${poisonDamage}`);
    }
  }

  applyDragonFire(attacker, defender) {
    if (attacker.name === 'Дракон' && this.round % 3 === 0) {
      defender.health -= 3;
      this.log.push(
        'Каждый 3-й ход Дракон дышит огнём, нанося дополнительно 3 урона'
      );
    }
  }

  nextTurn() {
    const attacker = this.turn === 'character' ? this.character : this.monster;
    const defender = this.turn === 'character' ? this.monster : this.character;
    const isCharacter = this.turn === 'character';

    if (!this.rollHit(attacker, defender)) {
      this.log.push(`${attacker.name} промахнулся`);
    } else {
      let damage = this.calculateBaseDamage(attacker);
      damage = this.applyAttackerEffects(
        attacker,
        defender,
        damage,
        isCharacter
      );
      damage = this.applyDefenderEffects(
        attacker,
        defender,
        damage,
        isCharacter
      );

      defender.health -= damage;
      this.log.push(`${attacker.name} атакует и наносит ${damage} урона`);

      if (isCharacter) {
        this.applyPoison(attacker, defender);
      }

      if (!isCharacter && attacker.name === 'Дракон') {
        this.applyDragonFire(attacker, defender);
      }
    }

    if (defender.health <= 0) {
      this.log.push(`${defender.name} побеждён`);
      return 'end';
    }

    this.turn = this.turn === 'character' ? 'monster' : 'character';
    this.round += 1;
    return 'continue';
  }

  getLog() {
    return this.log;
  }
}
