import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { serializer } from '../../utils/serializer.js';
import sendResponsePacket from '../../utils/response/createResponse.js';
import { v4 as uuidv4 } from 'uuid';

let gameState = {
  monsters: [],
};

// 몬스터 생성 요청 처리 핸들러
const spawnMonsterHandler = (socket, packet) => {
  try {
    console.log('수신한 패킷:', JSON.stringify(packet));
    const monsterId = 1;
    const monsterNumber = 1;
    console.log(`몬스터 생성: ID = ${monsterId}, 번호 = ${monsterNumber}`);
    // 몬스터 생성 로직 처리
    if (typeof monsterId !== 'number' || typeof monsterNumber !== 'number') {
      console.error('몬스터 생성에 실패했습니다. 필요한 정보가 부족합니다.');
      return;
    }
    console.log(`몬스터 생성: ID = ${monsterId}, 번호 = ${monsterNumber}`);
    addMonsterToGameState(monsterId, monsterNumber);

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

    console.log(`소켓:`, socket);
    sendResponsePacket(socket, PACKET_TYPE.SPAWN_MONSTER_RESPONSE, {
      spawnMonsterResponse: spawnMonsterResponse,
    });

    console.log(`몬스터 생성 응답 전송: ID = ${monsterId}, 번호 = ${monsterNumber}`);
  } catch (error) {
    console.error('Error in spawnMonsterHandler:', error);
  }
};

// 게임 상태에 몬스터 추가하는 함수
const addMonsterToGameState = (monsterId, monsterNumber) => {
  const newMonster = {
    id: monsterId,
    number: monsterNumber,
    position: { x: 0, y: 0 }, // 초기 위치 설정
    hp: 100, // 초기 체력 설정
  };
  gameState.monsters.push(newMonster); // 몬스터 목록에 추가
  console.log(`게임 상태에 몬스터 추가: ID = ${monsterId}, 번호 = ${monsterNumber}`);
};

// 고유한 몬스터 ID를 생성하는 함수
let currentMonsterId = 1; // 몬스터 ID의 초기값
const generateUniqueMonsterId = () => {
  return currentMonsterId++; // 현재 ID를 반환하고 증가시킴
};

// 클라이언트에서 몬스터 생성 요청을 수신하는 예시 함수
const receiveSpawnMonsterRequest = (socket) => {
  const monsterId = generateUniqueMonsterId(); // 고유 ID 생성
  const monsterNumber = Math.floor(Math.random() * 5) + 1; // 랜덤 번호 생성

  const requestPacket = {
    monsterId,
    monsterNumber,
  };

  console.log('생성된 요청 패킷:', requestPacket);

  // 몬스터 생성 요청 핸들러 호출
  spawnMonsterHandler(socket, requestPacket); // socket을 함께 전달
};

receiveSpawnMonsterRequest();

export default spawnMonsterHandler;
