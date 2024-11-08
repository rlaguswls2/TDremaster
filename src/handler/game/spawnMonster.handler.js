import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { serializer } from '../../utils/serializer.js';
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
    console.log(`몬스터 생성: ID = ${monsterId}, 번호 = ${monsterNumber}`);
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
      spawnMonsterResponse: spawnMonsterResponse,
    });
    console.log(`몬스터 생성 응답 전송: ID = ${monsterId}, 번호 = ${monsterNumber}`);
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
