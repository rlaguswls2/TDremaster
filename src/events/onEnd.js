import { sendGameOverNotification } from '../handler/game/notification/sendNotification.js';
import { activePlayers, playerState } from '../sessions/sessions.js';

export const onEnd = (socket) => async () => {
  console.log('클라이언트 연결이 종료되었습니다.');
  console.log('삭제 전 남은 플레이어 수: ', playerState.length);
  console.log('삭제 전 남은 매칭게임 수: ', activePlayers.length);
  sendGameOverNotification({ socket });
  console.log('삭제 후 남은 플레이어 수: ', playerState.length);
  console.log('삭제 후 남은 매칭게임 수: ', activePlayers.length);
};
