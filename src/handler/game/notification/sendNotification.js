import { PACKET_TYPE } from '../../../constants/header.js';
import { getProtoMessages } from '../../../init/loadProto.js';
import sendResponsePacket from '../../../utils/response/createResponse.js';

export const sendEnemyTowerNotification = (opponentSocket, towerData) => {
  const protoMessages = getProtoMessages();
  const S2CAddEnemyTowerNotification = protoMessages.test.S2CAddEnemyTowerNotification;

  const addEnemyTowerNotification = S2CAddEnemyTowerNotification.create({
    towerId: towerData.towerId,
    x: towerData.x,
    y: towerData.y,
  });

  sendResponsePacket(opponentSocket, PACKET_TYPE.ADD_ENEMY_TOWER_NOTIFICATION, {
    addEnemyTowerNotification,
  });
};

export const sendStateSyncNotification = (socket, playerState) => {
  const protoMessages = getProtoMessages();
  const StateSyncNotification = protoMessages.test.S2CStateSyncNotification;

  const stateSyncNotification = StateSyncNotification.create({
    userGold: playerState.userGold,
    baseHp: playerState.baseHp,
    score: playerState.score,
    monsterLevel: playerState.monsterLevel,
  });

  sendResponsePacket(socket, PACKET_TYPE.STATE_SYNC_NOTIFICATION, { stateSyncNotification });
};

export const sendEnemyMonsterDeathNotification = (opponentSocket, monsterId) => {
  const protoMessages = getProtoMessages();
  const S2CEnemyMonsterDeathNotification = protoMessages.test.S2CEnemyMonsterDeathNotification;

  const enemyMonsterDeathNotification = S2CEnemyMonsterDeathNotification.create({ monsterId });

  sendResponsePacket(opponentSocket, PACKET_TYPE.ENEMY_MONSTER_DEATH_NOTIFICATION, {
    enemyMonsterDeathNotification,
  });
};

export const sendSpawnEnemyMonsterNotification = (opponentSocket, monsterId, monsterNumber) => {
  const protoMessages = getProtoMessages();
  const S2CSpawnEnemyMonsterNotification = protoMessages.test.S2CSpawnEnemyMonsterNotification;

  const spawnEnemyMonsterNotification = S2CSpawnEnemyMonsterNotification.create({
    monsterId,
    monsterNumber,
  });

  sendResponsePacket(opponentSocket, PACKET_TYPE.SPAWN_ENEMY_MONSTER_NOTIFICATION, {
    spawnEnemyMonsterNotification,
  });
};

export const sendEnemyTowerAttackNotification = (opponentSocket, towerId, monsterId) => {
  const protoMessages = getProtoMessages();
  const S2CEnemyTowerAttackNotification = protoMessages.test.S2CEnemyTowerAttackNotification;

  const enemyTowerAttackNotification = S2CEnemyTowerAttackNotification.create({
    towerId,
    monsterId,
  });

  sendResponsePacket(opponentSocket, PACKET_TYPE.ENEMY_TOWER_ATTACK_NOTIFICATION, {
    enemyTowerAttackNotification,
  });
};

export const sendOpponentBaseHpUpdateNotification = (opponentSocket, baseHp) => {
  const protoMessages = getProtoMessages();
  const S2CUpdateBaseHPNotification = protoMessages.test.S2CUpdateBaseHPNotification;

  const opponentUpdateBaseHpNotification = S2CUpdateBaseHPNotification.create({
    isOpponent: true, // 상대방이므로 true
    baseHp,
  });

  sendResponsePacket(opponentSocket, PACKET_TYPE.UPDATE_BASE_HP_NOTIFICATION, {
    updateBaseHpNotification: opponentUpdateBaseHpNotification,
  });

  console.log(`상대방에게 기지 HP 업데이트 알림 전송: 현재 HP = ${baseHp}`);
};
