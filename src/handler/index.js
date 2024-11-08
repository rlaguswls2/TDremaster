import { PACKET_TYPE } from '../constants/header.js';
import login from './auth/login.handler.js';
import register from './auth/register.handler.js';
import matching from './game/match.handler.js';
import monsterAttackBaseHandler from './game/monsterAttackBase.handler.js';
import { monsterDeathHandler } from './game/monsterDeath.handler.js';
import spawnMonsterHandler from './game/spawnMonster.handler.js';

const handlers = {
  [PACKET_TYPE.LOGIN_REQUEST]: {
    handler: login,
    protoType: 'test.C2SLoginRequest',
  },
  [PACKET_TYPE.MATCH_REQUEST]: {
    handler: matching,
    protoType: 'test.C2SMatchRequest',
  },
  [PACKET_TYPE.REGISTER_REQUEST]: {
    handler: register,
    protoType: 'test.CS2RegisterRequest',
  },
  [PACKET_TYPE.SPAWN_MONSTER_REQUEST]: {
    handler: spawnMonsterHandler,
    protoType: 'test.C2SSpawnMonsterRequest',
  },
  [PACKET_TYPE.SPAWN_MONSTER_RESPONSE]: {
    handler: undefined,
    protoType: 'test.S2CSpawnMonsterResponse',
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
