import { playerState } from './sessions.js';

export class PlayerState {
  constructor(id, gameState) {
    this.id = id;
    this.userGold = gameState.gold;
    this.baseHp = gameState.base.hp;
    this.monsterLevel = gameState.monsterLevel;
    this.score = 0;
    this.towers = gameState.towers.map((tower) => ({
      towerId: tower.towerId,
      x: tower.x,
      y: tower.y,
    }));
    this.monsters = gameState.monsters.map((monster) => ({
      monsterId: monster.monsterId,
      monsterNumber: monster.monsterNumber,
      level: monster.level,
    }));
  }

  setUserGold(gold) {
    this.gold = gold;
  }

  setBaseHp(baseHp) {
    this.baseHp = baseHp;
  }

  setMonsterLevel(monsterLevel) {
    this.monsterLevel = monsterLevel;
  }

  setScore(score) {
    this.score = score;
  }

  addTower(tower) {
    this.towers.push(tower);
  }

  addMonster(monster) {
    this.monsters.push(monster);
  }

  killMonster(monsterId) {
    for (let i = 0; i < this.monsters.length; i++) {
      if (this.monsters[i].monsterId === monsterId) {
        this.monsters.splice(i, 1);
        break;
      }
    }
  }
}

export const removePlayerState = (socket) => {
  for (let i = 0; i < playerState.length; i++) {
    if (playerState[i].id === socket) {
      return playerState.splice(i, 1);
    }
  }
};
