import { PACKET_TYPE } from '../../constants/header.js';
import monsterAttackBaseHandler from './monsterAttackBase.handler.js';

// 기지 상태를 관리하는 변수
const INITIAL_BASE_HP = 100;
let baseState = {
  hp: INITIAL_BASE_HP,
};

// 몬스터 공격 요청 처리 핸들러
const handleMonsterAttackRequest = (socket, packet) => {
  try {
    const { damage } = packet;

    // 몬스터 공격 핸들러 호출
    monsterAttackBaseHandler({ damage });

    // 클라이언트에 기지 HP 업데이트 알림 전송
    socket.emit(PACKET_TYPE.UPDATE_BASE_HP_NOTIFICATION, { baseHp: baseState.hp });
  } catch (error) {
    console.error('몬스터 공격 요청 처리 중 오류 발생:', error);
  }
};

// 소켓 연결 시 클라이언트로부터 오는 메시지 리스너
const setupSocketListeners = (socket) => {
  console.log('소켓 객체:', socket);
  socket.on(PACKET_TYPE.MONSTER_ATTACK_BASE_REQUEST, (packet) => {
    handleMonsterAttackRequest(socket, packet);
  });
};

export default setupSocketListeners;
