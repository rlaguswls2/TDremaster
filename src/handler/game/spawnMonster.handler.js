import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { getOpponentSocket } from '../../utils/match/matchQueue.js';
import sendResponsePacket from '../../utils/response/createResponse.js';

// 몬스터 생성 요청 처리 핸들러
const spawnMonsterHandler = ({ socket }) => {
  try {
    const monsterId = generateUniqueMonsterId();
    const monsterNumber = Math.floor(Math.random() * 5) + 1;
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
      const S2CSpawnEnemyMonsterNotification = protoMessages.test.S2CSpawnEnemyMonsterNotification;
      const spawnEnemyNotification = S2CSpawnEnemyMonsterNotification.create({
        monsterId,
        monsterNumber,
      });
      sendResponsePacket(opponentSocket, PACKET_TYPE.SPAWN_ENEMY_MONSTER_NOTIFICATION, {
        spawnEnemyNotification,
      });
      console.log(`상대방에게 몬스터 생성 알림 전송: ID = ${monsterId}, 번호 = ${monsterNumber}`);
    } else {
      console.log('상대방 소켓을 찾을 수 없습니다.');
    }
    console.log(`몬스터 생성 응답 전송: ID = ${monsterId}, 번호 = ${monsterNumber}`);
  } catch (error) {
    console.error('Error in spawnMonsterHandler:', error);
  }
};

// 고유한 몬스터 ID를 생성하는 함수
let currentMonsterId = 1; // 몬스터 ID의 초기값
const generateUniqueMonsterId = () => {
  return currentMonsterId++; // 현재 ID를 반환하고 증가시킴
};
export default spawnMonsterHandler;
