import { PlayerState } from '../../sessions/game.session.js';
import { playerState, userHighScore } from '../../sessions/sessions.js';
import { addToMatchQueue, getMatchPlayers } from '../../sessions/user.session.js';
import { sendMatchStartNotification } from './notification/sendNotification.js';

export const matching = ({ socket }) => {
  try {
    addToMatchQueue(socket);
    const players = getMatchPlayers();
    if (players) {
      const { playerA, playerB } = players;

      // userHighScore는 userSession
      const userSessionA = userHighScore.find((user) => user.socket === playerA);
      const userSessionB = userHighScore.find((user) => user.socket === playerB);

      const highScoreA = userSessionA.highScore;
      const highScoreB = userSessionB.highScore;

      const playerStateA = new PlayerState(playerA, userSessionA.id, highScoreA);
      const playerStateB = new PlayerState(playerB, userSessionB.id, highScoreB);

      // 게임 내에 추적할 각 유저 스테이트에 추가
      playerState.push(playerStateA);
      playerState.push(playerStateB);

      sendMatchStartNotification(playerA, playerB);

      console.log('Match started two players');
    } else {
      console.log('Waiting for another player to join the match');
    }
  } catch (error) {
    console.error('Error in matchRequest:', error);
  }
};
