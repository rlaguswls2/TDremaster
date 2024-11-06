import { HANDLER_IDS } from '../constants/handlerIds.js';
import { PACKET_TYPE } from '../constants/header.js';
import login from './auth/login.handler.js';
import locationUpdateHandler from './game/locationUpdate.handler.js';
import matchStartNotification from './game/matchStart.notification.js';
import initialHandler from './user/initial.handler.js';

const handlers = {
  [PACKET_TYPE.MATCH_START_NOTIFICATION]: {
    handler: matchStartNotification,
    protoType: 'test.S2CMatchStartNotification',
  },
  [PACKET_TYPE.LOGIN_REQUEST]: {
    handler: login,
    protoType: 'test.C2SLoginRequest',
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
