import { PACKET_TYPE } from '../constants/header.js';
import login from './auth/login.handler.js';
import register from './auth/register.handler.js';
import matching from './game/match.handler.js';
import towerAttack from './game/towerAttack.handler.js';
import towerPurchase from './game/towerPurchase.handler.js';
import spawnMonsterHandler from './game/spawnMonster.handler.js';
import monsterAttackBaseHandler from './game/monsterAttackBase.handler.js';
import { monsterDeathHandler } from './game/monsterDeath.handler.js';

const handlers = {
  [PACKET_TYPE.LOGIN_REQUEST]: {
    handler: login,
    protoType: 'test.C2SLoginRequest',
  },
  [PACKET_TYPE.MATCH_REQUEST]: {
    handler: matching,
    protoType: 'test.C2SMatchRequest',
  },
  [PACKET_TYPE.TOWER_PURCHASE_REQUEST]: {
    handler: towerPurchase,
    protoType: 'test.C2STowerPurchaseRequest',
  },
  [PACKET_TYPE.TOWER_ATTACK_REQUEST]: {
    handler: towerAttack,
    protoType: 'test.C2STowerAttackRequest',
  },
  [PACKET_TYPE.ENEMY_TOWER_ATTACK_NOTIFICATION]: {
    handler: towerAttack,
    protoType: 'test.S2CEnemyTowerAttackNotification',
  },
  [PACKET_TYPE.REGISTER_REQUEST]: {
    handler: register,
    protoType: 'test.CS2RegisterRequest',
  },
  [PACKET_TYPE.SPAWN_MONSTER_REQUEST]: {
    handler: spawnMonsterHandler,
    protoType: 'test.C2SSpawnMonsterRequest',
  },
  [PACKET_TYPE.MONSTER_ATTACK_BASE_REQUEST]: {
    handler: monsterAttackBaseHandler,
    protoType: 'test.C2SMonsterAttackBaseRequest',
  },
  [PACKET_TYPE.MONSTER_DEATH_NOTIFICATION]: {
    handler: monsterDeathHandler,
    protoType: 'test.S2CEnemyMonsterDeathNotification',
  },
};

export const getHandlerByPacketType = (packetType) => {
  if (!handlers[packetType]) {
    throw Error();
  }
  return handlers[packetType].handler;
};

export const getProtoTypeNameByHandlerId = (packetType) => {
  if (!handlers[packetType]) {
    throw Error();
  }
  return handlers[packetType].protoType;
};
