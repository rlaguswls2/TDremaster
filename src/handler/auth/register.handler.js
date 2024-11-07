import jwt from "jsonwebtoken";
import { PACKET_TYPE, PACKET_TYPE_LENGTH } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { getGameSession } from '../../sessions/game.session.js';
import sendResponsePacket from '../../utils/response/createResponse.js';
import { serializer } from '../../utils/serializer.js';
import { createUser } from "../../db/user/user.db.js";

const register = ({ socket, payload }) => {
  try {
    const protoMessages = getProtoMessages();

    const GamePacket = protoMessages.test.GamePacket;
    const gamePacket = GamePacket.decode(payload);//decode해준다.
    console.log(`Decoded GamePacket:`, gamePacket);

    const registerRequest = gamePacket.registerRequest;//1번 register요청 /src/protobuf/test.proto
    if (!registerRequest) {
      throw new Error('Invalid payload type in GamePacket for register request.');
    }



    // const { email, id, password, passwordConfirm } = registerRequest;
    const { email, id, password} = registerRequest;//email,id,password을 입력받는다. passwordConfirm을 일단 제외한다.
    console.log(`in registerHandler.js data: ${email}, ${id}, ${password}`);

    //비밀번호 비밀번호 확인이 일치하는지 확인
    // if (password !== passwordConfirm) {
    //   throw new Error('Dismatch password passwordConfirm.');
    // }
    //값이 제대로 들어갔는지 확인
    
    //회원가입시 jwt발급이 필요한지 고민
    // const jwtToken = jwt.sign({ email, id }, "SECRET_KEY", { expiresIn: '1h' });//SECRET_KEY부분임시로 채움, 만료시간 1시간으로 설정

    //db에 회원가입 정보 채울 공간

    createUser(email,id,password);






    // S2CRegisterResponse 메시지 생성 및 직렬화
    const S2CRegisterResponse = protoMessages.test.S2CRegisterResponse;
    const responsePayload = S2CRegisterResponse.create({
      id: id,
      password: password,
      email: email,
    });//

    sendResponsePacket(socket, PACKET_TYPE.REGISTER_RESPONSE, {
      registerResponse: responsePayload,
    });
    
  } catch (error) {
    //register실패시 
    console.error('Error handling register request:', error);

    const S2CRegisterResponse = protoMessages.test.S2CRegisterResponse;
    const responsePayload = S2CRegisterResponse.create({
      id: '',
      password: '',
      email: '',
    });// 실패시 넘겨줄 response

    sendResponsePacket(socket, PACKET_TYPE.REGISTER_RESPONSE, {
      registerResponse: responsePayload,
    });
  }
};

export default register;
