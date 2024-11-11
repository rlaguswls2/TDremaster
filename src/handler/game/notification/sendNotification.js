import { PACKET_TYPE } from '../../../constants/header.js';
import { getProtoMessages } from '../../../init/loadProto.js';
import sendResponsePacket from '../../../utils/response/createResponse.js';
import { createGameStateData, createInitialGameState } from '../../../utils/state/createState.js';

export const sendMatchStartNotification = (playerA, playerB) => {
  const protoMessages = getProtoMessages();

  // 초기 게임 상태 생성
  const initialGameState = createInitialGameState();

  // 각 플레이어의 게임 상태 데이터 생성
  const A_GameState = createGameStateData(playerA);
  const B_GameState = createGameStateData(playerB);

  // 매칭 시작 알림 생성
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

  // 각 플레이어에게 매칭 시작 알림 전송
  sendResponsePacket(playerA, PACKET_TYPE.MATCH_START_NOTIFICATION, {
    matchStartNotification: A_MatchStartNotification,
  });

  sendResponsePacket(playerB, PACKET_TYPE.MATCH_START_NOTIFICATION, {
    matchStartNotification: B_MatchStartNotification,
  });
};

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

export const sendPlayerBaseHpUpdateNotification = (socket, baseHp) => {
  const protoMessages = getProtoMessages();
  const S2CUpdateBaseHPNotification = protoMessages.test.S2CUpdateBaseHPNotification;

  const updateBaseHpNotification = S2CUpdateBaseHPNotification.create({
    isOpponent: false,
    baseHp,
  });

  sendResponsePacket(socket, PACKET_TYPE.UPDATE_BASE_HP_NOTIFICATION, {
    updateBaseHpNotification,
  });

  console.log(`Base HP update notification sent to player: baseHp = ${baseHp}`);
};

export const sendGameOverNotification = async ({ socket, opponentSocket }) => {
  try {
    const protoMessages = getProtoMessages();
    const S2CGameOverNotification = protoMessages.test.S2CGameOverNotification;
    const myGameOverNotification = S2CGameOverNotification.create({
      isWin: false,
    });
    const opponentGameOverNotification = S2CGameOverNotification.create({
      isWin: true,
    });

    sendResponsePacket(socket, PACKET_TYPE.GAME_OVER_NOTIFICATION, {
      gameOverNotification: myGameOverNotification,
    });

    sendResponsePacket(opponentSocket, PACKET_TYPE.GAME_OVER_NOTIFICATION, {
      gameOverNotification: opponentGameOverNotification,
    });

    console.log(`게임 오버 데이터 전송`);
  } catch (error) {
    console.error('게임 오버 처리 중 오류 발생:', error);
  }
};
