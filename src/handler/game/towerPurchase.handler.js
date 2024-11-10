import { GAME_STATE } from '../../constants/gameState.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { getPlayerState } from '../../sessions/game.session.js';
import { getOpponentSocket } from '../../sessions/user.session.js';
import sendResponsePacket from '../../utils/response/createResponse.js';
import {
  sendEnemyTowerNotification,
  sendStateSyncNotification,
} from './notification/sendNotification.js';

export const towerPurchase = ({ socket, payload }) => {
  try {
    const protoMessages = getProtoMessages();

    const GamePacket = protoMessages.test.GamePacket;
    const gamePacket = GamePacket.decode(payload);
    console.log(`Decoded GamePacket:`, gamePacket);

    const towerPurchaseRequest = gamePacket.towerPurchaseRequest;
    if (!towerPurchaseRequest) {
      throw new Error('Invalid payload type in GamePacket for towerPurchase request.');
    }

    const { x, y } = towerPurchaseRequest;

    // 비즈니스 로직
    let newTower = null;

    // player state에 타워 추가
    const playerState = getPlayerState(socket);
    if (playerState) {
      // 골드가 충분한지 확인
      if (playerState.userGold >= GAME_STATE.TOWER_COST) {
        // 타워 생성
        newTower = generateTowers(1, [{ x, y }])[0];

        // 타워 추가 및 골드 차감
        playerState.addTower(newTower); // playerState의 towers에 새 타워 추가
        playerState.addGold(-GAME_STATE.TOWER_COST); // 타워 비용만큼 골드 차감
      } else {
        console.log('Insufficient gold for tower purchase.');
        return; // 골드 부족 시 타워 구매 중단
      }
    }
    // 비즈니스 로직 종료

    // S2CTowerPurchaseResponse 메시지 생성 및 직렬화
    const S2CTowerPurchaseResponse = protoMessages.test.S2CTowerPurchaseResponse;
    const towerPurchaseResponse = S2CTowerPurchaseResponse.create({ towerId: newTower.towerId });
    sendResponsePacket(socket, PACKET_TYPE.TOWER_PURCHASE_RESPONSE, {
      towerPurchaseResponse,
    });

    const opponentSocket = getOpponentSocket(socket);
    if (opponentSocket) {
      sendEnemyTowerNotification(opponentSocket, { towerId: newTower.towerId, x, y });
    } else {
      console.log('Not found opponent socket in ENEMY_TOWER_NOTIFICATION');
    }

    sendStateSyncNotification(socket, playerState);
  } catch (e) {
    console.error(e);
  }
};

var towerId = 0;

export const createTowerId = () => {
  return towerId++;
};

export const generateTowers = (count, positions) => {
  const protoMessages = getProtoMessages();
  const TowerData = protoMessages.test.TowerData;

  const towers = [];
  for (let i = 0; i < count; i++) {
    const towerId = createTowerId();

    const x = positions[i].x;
    const y = positions[i].y;

    towers.push(
      TowerData.create({
        towerId,
        x,
        y,
      }),
    );
  }

  return towers;
};
