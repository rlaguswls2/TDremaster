import { PACKET_TYPE } from '../constants/header.js';
import login from './auth/login.handler.js';
import matching from './game/match.handler.js';
import towerAttack from './game/towerAttack.handler.js';
import towerPurchase from './game/towerPurchase.handler.js';

const handlers = {
  [PACKET_TYPE.LOGIN_REQUEST]: {
    handler: login,
    protoType: 'test.C2SLoginRequest',
  },
  [PACKET_TYPE.MATCH_REQUEST]: {
    handler: matching,
    protoType: 'test.C2SMatchRequest',
  },
  [PACKET_TYPE.TOWER_PURCHASE_REQUEST]:{
    handler: towerPurchase,
    protoType: 'test.C2STowerPurchaseRequest',
  },
  [PACKET_TYPE.TOWER_ATTACK_REQUEST]:{
    handler: towerAttack,
    protoType: 'test.C2STowerAttackRequest',
  }
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
