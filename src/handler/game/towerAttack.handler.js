import { getProtoMessages } from '../../init/loadProto.js';
import { getOpponentSocket } from '../../sessions/user.session.js';
import { sendEnemyTowerAttackNotification } from './notification/sendNotification.js';

export const towerAttack = ({ socket, payload }) => {
  try {
    const protoMessages = getProtoMessages();

    const GamePacket = protoMessages.test.GamePacket;
    const gamePacket = GamePacket.decode(payload);

    const towerAttackRequest = gamePacket.towerAttackRequest;
    const { towerId, monsterId } = towerAttackRequest;
    if (!towerAttackRequest) {
      throw new Error('Invalid payload type in GamePacket for towerAttack request.');
    }

    // 상대방에게 타워 공격 알림 전송
    const opponentSocket = getOpponentSocket(socket);
    if (opponentSocket) {
      sendEnemyTowerAttackNotification(opponentSocket, towerId, monsterId);
    } else {
      console.log('Not found opponent socket in ENEMY_TOWER_ATTACK_NOTIFICATION');
    }
  } catch (e) {
    console.error(e);
  }
};
