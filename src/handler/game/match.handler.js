import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { addToMatchQueue, getMatchPlayers } from '../../utils/match/matchQueue.js';
import sendResponsePacket from '../../utils/response/createResponse.js';
import { createGameState, createInitialGameState } from '../../utils/state/createState.js';

const matching = ({ socket, payload }) => {
  try {
    const protoMessages = getProtoMessages();
    addToMatchQueue(socket);

    const players = getMatchPlayers();
    if (players) {
      const { playerA, playerB } = players;

      const initialGameState = createInitialGameState();
      const A_GameState = createGameState();
      const B_GameState = createGameState();

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

export default matching;
