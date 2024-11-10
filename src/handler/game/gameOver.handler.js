import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { removePlayerState } from '../../sessions/game.session.js';
import { clearMatch, getOpponentSocket } from '../../sessions/user.session.js';
import sendResponsePacket from '../../utils/response/createResponse.js';

// 게임 오버
export const sendGameOverNotification = ({ socket }) => {
  try {
    const opponentSocket = getOpponentSocket(socket);
    if (!opponentSocket) return;

    // db 각 플레이어에 highScore 저장

    removePlayerState(socket);
    removePlayerState(opponentSocket);
    clearMatch(socket);

    const protoMessages = getProtoMessages();

    if (!protoMessages || !protoMessages.test) {
      console.error('ProtoBuf 메시지가 올바르게 로드되지 않았습니다.');
      return;
    }

    const S2CGameOverNotification = protoMessages.test.S2CGameOverNotification;
    const myGameOverNotification = S2CGameOverNotification.create({
      isWin: false,
    });
    const opponentGameOverNotification = S2CGameOverNotification.create({
      isWin: true,
    });

    sendResponsePacket(socket, PACKET_TYPE.GAME_OVER_NOTIFICATION, {
      gameOverNotification: myGameOverNotification,
    });

    sendResponsePacket(opponentSocket, PACKET_TYPE.GAME_OVER_NOTIFICATION, {
      gameOverNotification: opponentGameOverNotification,
    });

    console.log(`게임 오버 데이터 전송`);
  } catch (error) {
    console.error('게임 오버 처리 중 오류 발생:', error);
  }
};
