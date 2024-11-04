import User from '../../classes/models/user.class.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createUser, findUserByDeviceId, updateUserLogin } from '../../db/user/user.db.js';
import { getGameSession } from '../../sessions/game.session.js';
import { addUser } from '../../sessions/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const initialHandler = async ({ socket, userId, payload }) => {
  try {
    const { deviceId, latency, playerId } = payload;

    let user = await findUserByDeviceId(deviceId);
    const coords = {
      x: 0,
      y: 0,
    };

    // 로그인 시 처리
    if (!user) {
      await createUser(deviceId);
    } else {
      await updateUserLogin(deviceId);
      coords.x = user.xCoord; // db의 x좌표
      coords.y = user.yCoord; // db의 y좌표
    }

    // 세션 생성
    user = new User(socket, deviceId, playerId, latency, coords);
    addUser(user);
    const gameSession = getGameSession(); // 게임 생성
    gameSession.addUser(user);

    const initialResponse = createResponse(HANDLER_IDS.INITIAL, RESPONSE_SUCCESS_CODE, {
      userId: deviceId,
      x: 10,
      y: 10,
    });

    socket.write(initialResponse);
  } catch (error) {
    console.error(error);
  }
};

export default initialHandler;
