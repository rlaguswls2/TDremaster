import { sendGameOverNotification } from './gameOver.handler.js';

// 게임 종료
export const gameEndHandler = ({ socket }) => {
  try {
    sendGameOverNotification({ socket });
  } catch (error) {
    console.error('게임 종료 처리 중 오류 발생:', error);
  }
};
