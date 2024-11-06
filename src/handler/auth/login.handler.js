import { PACKET_TYPE, PACKET_TYPE_LENGTH } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { getGameSession } from '../../sessions/game.session.js';
import { serializer } from '../../utils/serializer.js';

const login = ({ socket, payload }) => {
  try {
    const protoMessages = getProtoMessages();

    const GamePacket = protoMessages.test.GamePacket;
    const gamePacket = GamePacket.decode(payload);
    console.log(`Decoded GamePacket:`, gamePacket);

    const loginRequest = gamePacket.loginRequest;
    if (!loginRequest) {
      throw new Error('Invalid payload type in GamePacket for login request.');
    }

    const { id, password } = loginRequest;
    console.log(`in loginHandler.js data: ${id}, ${password}`);

    // id와 password로 인증 로직 처리
    // 로그인 로직 처리 (예: ID와 비밀번호 검증)
    const success = true; // 로그인 성공 여부를 예시로 설정
    const message = success ? 'Login successful.' : 'Login failed.';
    const token = success ? 'some-generated-token' : ''; // 로그인 성공 시 토큰 생성
    const failCode = success
      ? protoMessages.test.GlobalFailCode.NONE
      : protoMessages.common.GlobalFailCode.AUTHENTICATION_FAILED;

    // S2CLoginResponse 메시지 생성 및 직렬화
    const S2CLoginResponse = protoMessages.test.S2CLoginResponse;
    const responsePayload = S2CLoginResponse.create({ success, message, token, failCode });

    // GamePacket으로 S2CLoginResponse를 감싸기
    const responseGamePacket = GamePacket.create({
      loginResponse: responsePayload, // GamePacket의 oneof payload 필드에 설정
    });

    // GamePacket을 직렬화하여 전송
    const gamePacketBuffer = GamePacket.encode(responseGamePacket).finish();
    const packetType = PACKET_TYPE.LOGIN_RESPONSE;
    const serializedPacket = serializer(gamePacketBuffer, packetType);
    socket.write(serializedPacket);
    console.log('Sent login response to client.');
  } catch (error) {
    console.error('Error handling login request:', error);
  }
};

export default login;
