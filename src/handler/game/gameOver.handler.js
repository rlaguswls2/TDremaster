import { getPlayerState, removePlayerState } from '../../sessions/game.session.js';
import { clearMatch, getHighScore, getOpponentSocket } from '../../sessions/user.session.js';
import { updateScores } from '../../utils/db/highScoreUpdate.js';
import { sendGameOverNotification } from './notification/sendNotification.js';

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

    sendGameOverNotification(socket, opponentSocket);
  } catch (e) {
    console.error(e);
  }
};
