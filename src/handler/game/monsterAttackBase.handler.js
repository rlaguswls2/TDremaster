import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { getOpponentSocket } from '../../sessions/user.session.js';
import sendResponsePacket from '../../utils/response/createResponse.js';

// 몬스터 공격 요청 처리 핸들러
const monsterAttackBaseHandler = ({ socket, payload }) => {
  try {
    const protoMessages = getProtoMessages();

    if (!protoMessages || !protoMessages.test) {
      console.error('ProtoBuf 메시지가 올바르게 로드되지 않았습니다.');
      return;
    }

    const GamePacket = protoMessages.test.GamePacket;
    const gamePacket = GamePacket.decode(payload);
    console.log(`Decoded GamePacket:`, gamePacket);

    const damage = gamePacket.monsterAttackBaseRequest;

    if (typeof damage === 'undefined') {
      console.error('damage가 없습니다:', gamePacket);
      return;
    }

    const S2CUpdateBaseHPNotification = protoMessages.test.S2CUpdateBaseHPNotification;
    const updateBaseHpNotification = S2CUpdateBaseHPNotification.create({
      isOpponent: false,
      baseHp: damage,
    });

    sendResponsePacket(socket, PACKET_TYPE.UPDATE_BASE_HP_NOTIFICATION, {
      updateBaseHpNotification,
    });

    //★ 상대방 소켓 ★
    const opponentSocket = getOpponentSocket(socket);
    if (opponentSocket) {
      const opponentUpdateBaseHpNotification = S2CUpdateBaseHPNotification.create({
        isOpponent: true, // 상대방이므로 true
        baseHp: damage, // 클라이언트가 보낸 damage 사용
      });

      sendResponsePacket(opponentSocket, PACKET_TYPE.UPDATE_BASE_HP_NOTIFICATION, {
        updateBaseHpNotification: opponentUpdateBaseHpNotification,
      });

      console.log(`상대방에게 기지 HP 업데이트 알림 전송: 현재 HP = ${baseHp}`);
    } else {
      console.log('상대방 소켓을 찾을 수 없습니다.');
    }

    console.log(`기지 HP 업데이트 전송: 현재 HP = ${baseHp}`);
  } catch (error) {
    console.error('몬스터 공격 처리 중 오류 발생:', error);
  }
};

export default monsterAttackBaseHandler;
