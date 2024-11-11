import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { getPlayerState, removePlayerState } from '../../sessions/game.session.js';
import { clearMatch, getHighScore, getOpponentSocket } from '../../sessions/user.session.js';
import { updateScores } from '../../utils/db/highScoreUpdate.js';
import sendResponsePacket from '../../utils/response/createResponse.js';

export const gameOverHandler = async ({ socket }) => {
  try {
    const opponentSocket = getOpponentSocket(socket);
    if (!opponentSocket) return;

    const playerStateB = getPlayerState(opponentSocket); // 애가 이긴 놈(항상 이김 상대가 나가면)
    const userB = getHighScore(opponentSocket);
    userB.highScore = Math.max(userB.highScore, playerStateB.score);

    const playerStateA = getPlayerState(socket); // 진 놈
    const userA = getHighScore(socket);
    userA.highScore = Math.max(userA.highScore, playerStateA.score);

    await updateScores(socket, opponentSocket);

    removePlayerState(socket);
    removePlayerState(opponentSocket);
    clearMatch(socket);

    const protoMessages = getProtoMessages();
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
  } catch (e) {
    console.error(e);
  }
};
