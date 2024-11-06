import jwt from "jsonwebtoken";
import { PACKET_TYPE, PACKET_TYPE_LENGTH } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { getGameSession } from '../../sessions/game.session.js';
import sendResponsePacket from '../../utils/response/createResponse.js';
import { serializer } from '../../utils/serializer.js';

const register = ({ socket, payload }) => {
  try {
    const protoMessages = getProtoMessages();

    const GamePacket = protoMessages.test.GamePacket;
    const gamePacket = GamePacket.decode(payload);
    console.log(`Decoded GamePacket:`, gamePacket);

    const registerRequest = gamePacket.registerRequest;//1번 register요청 /src/protobuf/test.proto
    if (!registerRequest) {
      throw new Error('Invalid payload type in GamePacket for register request.');
    }

    const { email,id, password,passwordConfirm } = registerRequest;//email,id,password,passwordconfirm을 입력받는다.
    
    //비밀번호 비밀번호 확인이 일치하는지 확인
    if(password!==passwordConfirm){
        throw new Error('Dismatch password passwordConfirm.');
    }
    console.log(`in loginHandler.js data: ${email}, ${id}, ${password}`);

    // id와 password로 인증 로직 처리

    // 회원가입 로직 처리 (예: ID와 비밀번호 검증)
    const success = true; // 회원가입 성공 여부를 예시로 설정
    const message = success ? 'Register successful.' : 'Register failed.';
    const jwtToken=jwt.sign({email,id});
    
    // const token = success ? 'some-generated-token' : ''; // 로그인 성공 시 토큰 생성
    // const failCode = success
    //   ? protoMessages.test.GlobalFailCode.NONE
    //   : protoMessages.common.GlobalFailCode.AUTHENTICATION_FAILED;

    // S2CRegisterResponse 메시지 생성 및 직렬화
    const S2CRegisterResponse = protoMessages.test.S2CRegisterResponse;
    const responsePayload = S2CRegisterResponse.create({ success, message,jwtToken });// token, failCode

    sendResponsePacket(socket, PACKET_TYPE.REGISTER_RESPONSE, {
      registerResponse: responsePayload,
    });
  } catch (error) {
    console.error('Error handling register request:', error);
  }
};

export default register;
