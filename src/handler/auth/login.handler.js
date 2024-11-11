import jwt from 'jsonwebtoken'; //jwt토큰 발급을 위한 jwt 임포트
import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { userHighScore } from '../../sessions/sessions.js';
import { UserState } from '../../sessions/user.session.js';
import sendResponsePacket from '../../utils/response/createResponse.js';

export const login = async ({ socket, payload }) => {
  try {
    const protoMessages = getProtoMessages();

    const GamePacket = protoMessages.test.GamePacket;
    const gamePacket = GamePacket.decode(payload);

    const loginRequest = gamePacket.loginRequest;
    if (!loginRequest) {
      throw new Error('Invalid payload type in GamePacket for login request.');
    }
    const { id, password } = loginRequest; //id와 password를 받아온다.

    // newuser 로그인 시 id 와 highscore를 전달
    const newuser = new UserState(socket, id);
    await newuser.setHighScore(); // 처음 게임 로그인 시 highscore 정보 가져옴
    userHighScore.push(newuser);

    //user가 존재하는지 확인
    const success = true; // 로그인 성공 여부를 예시로 설정

    // 로그인 로직 처리 (예: ID와 비밀번호 검증)
    const message = success ? 'Login successful.' : 'Login failed.';
    const jwtToken = jwt.sign({ id, password }, 'SECRET_KEY', { expiresIn: '1h' }); //SECRET_KEY부분임시로 채움, 만료시간 1시간으로 설정
    const failCode = success
      ? protoMessages.test.GlobalFailCode.NONE
      : protoMessages.common.GlobalFailCode.AUTHENTICATION_FAILED;

    // S2CLoginResponse 메시지 생성 및 직렬화
    const S2CLoginResponse = protoMessages.test.S2CLoginResponse;
    const responsePayload = S2CLoginResponse.create({ success, message, jwtToken, failCode });
    //updateUserLogin(id);
    sendResponsePacket(socket, PACKET_TYPE.LOGIN_RESPONSE, {
      loginResponse: responsePayload,
    });
  } catch (error) {
    console.error('Error handling login request:', error);
  }
};
