import { GAME_STATE, STAGE_UP_SCORE } from '../../constants/gameState.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { getPlayerState } from '../../sessions/game.session.js';
import { getOpponentSocket } from '../../sessions/user.session.js';
import {
  sendEnemyMonsterDeathNotification,
  sendStateSyncNotification,
} from './notification/sendNotification.js';

export const monsterDeathHandler = ({ socket, payload }) => {
  try {
    const protoMessages = getProtoMessages();
    const GamePacket = protoMessages.test.GamePacket;
    const monsterDeathNotification = GamePacket.decode(payload).monsterDeathNotification;

    if (!monsterDeathNotification) {
      throw new Error('Invalid payload for monster death notification');
    }

    const { monsterId } = monsterDeathNotification;

    // 몬스터 제거 및 골드/스코어 획득
    const playerStateA = getPlayerState(socket);
    if (playerStateA) {
      playerStateA.killMonster(monsterId);
      // MONSTER_DROP_GOLD 상수를 사용하여 골드 추가
      playerStateA.addGold(GAME_STATE.MONSTER_DROP_GOLD);

      // MONSTER_SCORE 상수를 사용하여 스코어 추가
      playerStateA.addScore(GAME_STATE.MONSTER_SCORE);
      playerStateA.monsterLevel = Math.floor(playerStateA.score / STAGE_UP_SCORE) + 1;
    }
    playerStateA.monsterLevel = Math.floor(playerStateA.score / STAGE_UP_SCORE) + 1;
    const playerState = getPlayerState(socket);

    const opponentSocket = getOpponentSocket(socket);
    if (opponentSocket) {
      sendEnemyMonsterDeathNotification(opponentSocket, monsterId);
    } else {
      console.log('Not found opponent socket in ENEMY_MONSTER_DEATH_NOTIFICATION');
    }

    sendStateSyncNotification(socket, playerState);
  } catch (error) {
    console.error(error);
  }
};
