import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import sendResponsePacket from '../../utils/response/createResponse.js';

// 게임 오버
const S2CGameOverNotification = ({ socket, isWin }) => {
  try {
    if (!socket) return;

    const protoMessages = getProtoMessages();

    if (!protoMessages || !protoMessages.test) {
      console.error('ProtoBuf 메시지가 올바르게 로드되지 않았습니다.');
      return;
    }

    const S2CGameOverNotification = protoMessages.test.S2CGameOverNotification;
    const gameOverNotification = S2CGameOverNotification.create({
      isWin,
    });

    sendResponsePacket(socket, PACKET_TYPE.GAME_OVER_NOTIFICATION, {
      gameOverNotification,
    });

    console.log(`게임 오버 데이터 전송`);
  } catch (error) {
    console.error('게임 오버 처리 중 오류 발생:', error);
  }
};

export default S2CGameOverNotification;
