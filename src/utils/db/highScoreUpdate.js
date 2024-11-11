import { updateHighScoreById } from '../../db/user/user.db.js';
import { getPlayerState } from '../../sessions/game.session.js';
import { getHighScore } from '../../sessions/user.session.js';

export const updateScores = async (socket, opponentSocket) => {
  const playerStateA = getPlayerState(socket); // 게임 중 하이스코어
  const playerStateB = getPlayerState(opponentSocket);
  const gameScoreA = playerStateA.score;
  const gameScoreB = playerStateB.score;

  const dbStateA = getHighScore(socket);
  const dbStateB = getHighScore(opponentSocket);

  const playerA_id = dbStateA.id;
  const playerB_id = dbStateB.id;

  console.log(playerA_id, playerB_id);
  // 게임 점수와 DB 하이스코어 비교 및 업데이트
  const updatedA = await updateHighScoreById(playerA_id, gameScoreA);
  const updatedB = await updateHighScoreById(playerB_id, gameScoreB);

  if (updatedA) {
    console.log(`Player A의 하이스코어가 업데이트되었습니다: ${gameScoreA}`);
  }

  if (updatedB) {
    console.log(`Player B의 하이스코어가 업데이트되었습니다: ${gameScoreB}`);
  }
};
