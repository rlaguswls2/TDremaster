import { GAME_STATE } from '../constants/gameState.js';
import {
  generateMonsterData,
  generateMonsterNumber,
} from '../handler/game/spawnMonster.handler.js';
import { generateTowers } from '../handler/game/towerPurchase.handler.js';
import { playerState } from './sessions.js';

export class PlayerState {
  constructor(socket, userId, highScore) {
    this.socket = socket;
    this.userId = userId;
    this.userGold = GAME_STATE.INITIAL_GOLD;
    this.baseHp = GAME_STATE.INITIAL_BASE_HP;
    this.maxHp = GAME_STATE.INITIAL_BASE_HP;
    this.monsterLevel = GAME_STATE.MONSTER_LEVEL;
    this.score = 0;
    this.highScore = highScore;
    this.towers = generateTowers(
      GAME_STATE.INITIAL_TOWER_COUNT,
      GAME_STATE.INITIAL_TOWER_POSITIONS,
    );
    this.monsterData = generateMonsterData(
      generateMonsterNumber(),
      GAME_STATE.INITIAL_MONSTER_LEVEL,
    );
    this.monsters = [];
  }

  addGold(gold) {
    this.userGold += gold;
  }

  getDamage(damage) {
    this.baseHp -= damage;
  }

  setMonsterLevel(monsterLevel) {
    this.monsterLevel = monsterLevel;
  }

  addScore(score) {
    this.score += score;
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

export const getPlayerState = (socket) => {
  for (let i = 0; i < playerState.length; i++) {
    if (playerState[i].socket === socket) {
      return playerState[i];
    }
  }
};

export const removePlayerState = (socket) => {
  for (let i = 0; i < playerState.length; i++) {
    if (playerState[i].socket === socket) {
      return playerState.splice(i, 1);
    }
  }
};
