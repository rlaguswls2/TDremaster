import bcrypt from 'bcrypt';
import { PACKET_TYPE } from '../../constants/header.js';
import { createUser, findUserById } from '../../db/user/user.db.js';
import { getProtoMessages } from '../../init/loadProto.js';
import sendResponsePacket from '../../utils/response/createResponse.js';

const register = async ({ socket, payload }) => {
  const protoMessages = getProtoMessages();
  let success = true; //성공을 판별하는 변수
  let errorMessage = ''; //에러메시지를 담을 공간
  try {
    const GamePacket = protoMessages.test.GamePacket;
    const gamePacket = GamePacket.decode(payload); //decode해준다.
    console.log(`Decoded GamePacket:`, gamePacket);

    const registerRequest = gamePacket.registerRequest; //1번 register요청 /src/protobuf/test.proto
    if (!registerRequest) {
      throw new Error('Invalid payload type in GamePacket for register request.');
    }

    const { email, id, password } = registerRequest; //email,id,password을 입력받는다. passwordConfirm을 일단 제외한다.
    console.log(`in registerHandler.js data: ${email}, ${id}, ${password}`);
    const bcryptPassword = await bcrypt.hash(password, 10); //password 암호화

    const existuser = await findUserById(id);
    if (existuser !== null) {
      //중복이 있으면 id 중복이 있다는 뜻
      success = false;
      throw new Error('This id already exists!');
    }

    // const failCode = success
    //   ? protoMessages.test.GlobalFailCode.NONE
    //   : protoMessages.common.GlobalFailCode.AUTHENTICATION_FAILED;

    //암호화한 password로 유저생성
    createUser(email, id, bcryptPassword);

    // S2CRegisterResponse 메시지 생성 및 직렬화
    const S2CRegisterResponse = protoMessages.test.S2CRegisterResponse;
    const responsePayload = S2CRegisterResponse.create({
      success,
      message: '회원가입 성공',
      failCode: 0,
    }); //

    sendResponsePacket(socket, PACKET_TYPE.REGISTER_RESPONSE, {
      registerResponse: responsePayload,
    });
  } catch (error) {
    //register실패시
    console.error('Error handling register request:', error);

    errorMessage = error;
    // const failCode = success
    // ? protoMessages.test.GlobalFailCode.NONE
    // : protoMessages.common.GlobalFailCode.AUTHENTICATION_FAILED;

    const S2CRegisterResponse = protoMessages.test.S2CRegisterResponse;
    const responsePayload = S2CRegisterResponse.create({
      success,
      errorMessage,
      failCode: 1,
    }); // 실패시 넘겨줄 response

    sendResponsePacket(socket, PACKET_TYPE.REGISTER_RESPONSE, {
      registerResponse: responsePayload,
    });
  }
};

export default register;
