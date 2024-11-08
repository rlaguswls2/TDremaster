import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { getOpponentSocket } from '../../utils/match/matchQueue.js';
import sendResponsePacket from '../../utils/response/createResponse.js';

export const monsterDeathHandler = ({ socket, payload }) => {
  try {
    const protoMessages = getProtoMessages();
    const GamePacket = protoMessages.test.GamePacket;
    const monsterDeathNotification = GamePacket.decode(payload).monsterDeathNotification;

    if (!monsterDeathNotification) {
      throw new Error('Invalid payload for monster death notification');
    }

    const { monsterId } = monsterDeathNotification;

    // 상대방에게 Notification 전송
    const opponentSocket = getOpponentSocket(socket);
    if (opponentSocket) {
      const S2CEnemyMonsterDeathNotification = protoMessages.test.S2CEnemyMonsterDeathNotification;
      const enemyMonsterDeathNotification = S2CEnemyMonsterDeathNotification.create({ monsterId });

      sendResponsePacket(opponentSocket, PACKET_TYPE.ENEMY_MONSTER_DEATH_NOTIFICATION, {
        enemyMonsterDeathNotification,
      });
    }

    console.log(`Notified opponent monster ${monsterId}'s death`);
  } catch (error) {
    console.error(error);
  }
};
