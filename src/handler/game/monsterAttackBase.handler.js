import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import sendResponsePacket from '../../utils/response/createResponse.js';

// 몬스터 공격 요청 처리 핸들러
const monsterAttackBaseHandler = ({ payload }) => {
  try {
    const protoMessages = getProtoMessages();

    const GamePacket = protoMessages.test.GamePacket;
    const gamePacket = GamePacket.decode(payload);
    console.log(`Decoded GamePacket:`, gamePacket);

    const damage = gamePacket.monsterAttackBaseRequest;

    if (typeof damage === 'undefined') {
      console.error('damage가 없습니다:', payload);
      return;
    }

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
