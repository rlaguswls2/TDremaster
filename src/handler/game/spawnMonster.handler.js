import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { getPlayerState } from '../../sessions/game.session.js';
import { getOpponentSocket } from '../../sessions/user.session.js';
import sendResponsePacket from '../../utils/response/createResponse.js';
import { sendSpawnEnemyMonsterNotification } from './notification/sendNotification.js';

// 몬스터 생성 요청 처리 핸들러
export const spawnMonsterHandler = ({ socket }) => {
  try {
    const monsterId = generateUniqueMonsterId();
    const monsterNumber = generateMonsterNumber();
    // 몬스터 생성 로직 처리
    if (typeof monsterId !== 'number' || typeof monsterNumber !== 'number') {
      console.error('몬스터 생성에 실패했습니다. 필요한 정보가 부족합니다.');
      return;
    }
    const protoMessages = getProtoMessages();
    // protoMessages가 올바르게 로드되었는지 확인
    if (!protoMessages || !protoMessages.test) {
      console.error('ProtoBuf 메시지가 올바르게 로드되지 않았습니다.');
      return;
    }

    // playerState에 몬스터 추가
    const playerState = getPlayerState(socket);
    if (playerState) {
      playerState.addMonster({ monsterId: monsterId });
    }

    // 클라이언트에게 응답 패킷 전송
    const S2CSpawnMonsterResponse = protoMessages.test.S2CSpawnMonsterResponse;
    const spawnMonsterResponse = S2CSpawnMonsterResponse.create({
      monsterId,
      monsterNumber,
    });
    sendResponsePacket(socket, PACKET_TYPE.SPAWN_MONSTER_RESPONSE, {
      spawnMonsterResponse,
    });

    const opponentSocket = getOpponentSocket(socket);
    if (opponentSocket) {
      sendSpawnEnemyMonsterNotification(opponentSocket, monsterId, monsterNumber);
    } else {
      console.log('Not found opponent socket in SPAWN_ENEMY_MONSTER_NOTIFICATION');
    }
  } catch (error) {
    console.error('Error in spawnMonsterHandler:', error);
  }
};

// 고유한 몬스터 ID를 생성하는 함수
let currentMonsterId = 1; // 몬스터 ID의 초기값
export const generateUniqueMonsterId = () => {
  return currentMonsterId++; // 현재 ID를 반환하고 증가시킴
};
export default spawnMonsterHandler;

export const generateMonsterNumber = () => {
  return Math.floor(Math.random() * 5) + 1;
};

export const generateMonsterData = (monsterNumber, level) => {
  const protoMessages = getProtoMessages();
  const MonsterData = protoMessages.test.MonsterData;
  const monsterId = generateUniqueMonsterId();

  const monsters = MonsterData.create({
    monsterId,
    monsterNumber: monsterNumber,
    level: level || 1, // 기본 레벨을 1로 설정
  });

  return monsters;
};
