import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { PlayerState } from '../../sessions/game.session.js';
import { playerState, userHighScore } from '../../sessions/sessions.js';
import { addToMatchQueue, getMatchPlayers } from '../../sessions/user.session.js';
import sendResponsePacket from '../../utils/response/createResponse.js';
import { createGameStateData, createInitialGameState } from '../../utils/state/createState.js';

export const matching = ({ socket }) => {
  try {
    const protoMessages = getProtoMessages();
    addToMatchQueue(socket);
    const players = getMatchPlayers();
    if (players) {
      const { playerA, playerB } = players;
      // 여기서 db로부터 highScore 가져와서 0대신 할당 0은 임시값
      // 아니면 로그인 했을 때 가져온 값을 할당
      // 여기서 쿼리 돌리면 끝
      const playerAState = userHighScore.find((user) => user.socket === playerA);
      const playerBState = userHighScore.find((user) => user.socket === playerB);
      const highScoreA = playerAState ? playerAState.highScore : 0;
      const highScoreB = playerBState ? playerBState.highScore : 0;

      const playerStateA = new PlayerState(playerA, playerAState.id, highScoreA);
      const playerStateB = new PlayerState(playerB, playerBState.id, highScoreB);

      // 게임 내에 추적할 각 유저 스테이트에 추가
      playerState.push(playerStateA);
      playerState.push(playerStateB);

      const initialGameState = createInitialGameState();

      // 생성한 PlayerState 객체 기반으로 data 생성
      const A_GameState = createGameStateData(playerA);
      const B_GameState = createGameStateData(playerB);

      const S2CMatchStartNotification = protoMessages.test.S2CMatchStartNotification;
      const A_MatchStartNotification = S2CMatchStartNotification.create({
        initialGameState,
        playerData: A_GameState,
        opponentData: B_GameState,
      });

      const B_MatchStartNotification = S2CMatchStartNotification.create({
        initialGameState,
        playerData: B_GameState,
        opponentData: A_GameState,
      });

      sendResponsePacket(playerA, PACKET_TYPE.MATCH_START_NOTIFICATION, {
        matchStartNotification: A_MatchStartNotification,
      });
      sendResponsePacket(playerB, PACKET_TYPE.MATCH_START_NOTIFICATION, {
        matchStartNotification: B_MatchStartNotification,
      });

      console.log('Match started two players');
    } else {
      console.log('Waiting for another player to join the match');
    }
  } catch (error) {
    console.error('Error in matchRequest:', error);
  }
};
