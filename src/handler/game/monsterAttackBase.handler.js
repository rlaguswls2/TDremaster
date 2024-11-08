import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import sendResponsePacket from '../../utils/response/createResponse.js';

// 몬스터 공격 요청 처리 핸들러
const monsterAttackBaseHandler = ({ payload }) => {
  try {
    const damage = payload.damage; // 클라이언트에서 보내는 damage

    if (typeof damage === 'undefined') {
      console.error('damage가 없습니다:', payload);
      return;
    }

    // 클라이언트에 기지 HP 업데이트 알림 전송
    const protoMessages = getProtoMessages();

    if (!protoMessages || !protoMessages.test) {
      console.error('ProtoBuf 메시지가 올바르게 로드되지 않았습니다.');
      return;
    }

    console.log(`기지 HP 업데이트 전송: 현재 HP = ${damage}`);
  } catch (error) {
    console.error('몬스터 공격 처리 중 오류 발생:', error);
  }
};

export default monsterAttackBaseHandler;
