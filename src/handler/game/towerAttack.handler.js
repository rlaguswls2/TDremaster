import { getProtoMessages } from '../../init/loadProto.js';
// import { createTowerId } from "./towerPurchase.handler.js";
// import { generateUniqueMonsterId } from "./spawnMonster.handler.js"
import { PACKET_TYPE } from '../../constants/header.js';
import { getOpponentSocket } from '../../utils/match/matchQueue.js';
import sendResponsePacket from '../../utils/response/createResponse.js';

const towerAttack = ({ socket, payload }) => {
  try {
    const protoMessages = getProtoMessages();

    const GamePacket = protoMessages.test.GamePacket;
    const gamePacket = GamePacket.decode(payload);

    const towerAttackRequest = gamePacket.towerAttackRequest;
    const { towerId, monsterId } = towerAttackRequest;
    if (!towerAttackRequest) {
      throw new Error('Invalid payload type in GamePacket for towerAttack request.');
    }

    const S2CEnemyTowerAttackNotification = protoMessages.test.S2CEnemyTowerAttackNotification;
    const enemyTowerAttackNotification = S2CEnemyTowerAttackNotification.create({
      towerId: towerId,
      monsterId: monsterId,
    });

    const opponentSocket = getOpponentSocket();
    sendResponsePacket(opponentSocket, PACKET_TYPE.ENEMY_TOWER_ATTACK_NOTIFICATION, {
      enemyTowerAttackNotification,
    });
  } catch (e) {
    console.error(e);
  }
};

export default towerAttack;
