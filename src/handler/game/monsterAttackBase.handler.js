import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { getPlayerState } from '../../sessions/game.session.js';
import { getOpponentSocket } from '../../sessions/user.session.js';
import sendResponsePacket from '../../utils/response/createResponse.js';
import { sendOpponentBaseHpUpdateNotification } from './notification/sendNotification.js';

// 몬스터 공격 요청 처리 핸들러
export const monsterAttackBaseHandler = ({ socket, payload }) => {
  try {
    const protoMessages = getProtoMessages();

    if (!protoMessages || !protoMessages.test) {
      console.error('ProtoBuf 메시지가 올바르게 로드되지 않았습니다.');
      return;
    }

    const GamePacket = protoMessages.test.GamePacket;
    const gamePacket = GamePacket.decode(payload);
    console.log(`Decoded GamePacket:`, gamePacket);

    const damage = gamePacket.monsterAttackBaseRequest.damage;

    if (typeof damage === 'undefined') {
      console.error('damage가 없습니다:', gamePacket);
      return;
    }

    // send response
    const playerState = getPlayerState(socket);
    playerState.getDamage(damage);
    const S2CUpdateBaseHPNotification = protoMessages.test.S2CUpdateBaseHPNotification;
    const updateBaseHpNotification = S2CUpdateBaseHPNotification.create({
      isOpponent: false,
      baseHp: playerState.baseHp,
    });

    sendResponsePacket(socket, PACKET_TYPE.UPDATE_BASE_HP_NOTIFICATION, {
      updateBaseHpNotification,
    });

    // send notification
    const opponentSocket = getOpponentSocket(socket);
    if (opponentSocket) {
      sendOpponentBaseHpUpdateNotification(opponentSocket, playerState.baseHp);
    } else {
      console.log('Not found opponent socket in UPDATE_BASE_HP_NOTIFICATION');
    }
  } catch (error) {
    console.error('몬스터 공격 처리 중 오류 발생:', error);
  }
};
