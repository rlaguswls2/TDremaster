import S2CGameOverNotification from './gameOver.handler.js';

// 게임 종료
const gameEndHandler = ({ socket }) => {
  try {
    S2CGameOverNotification({ socket });
  } catch (error) {
    console.error('게임 종료 처리 중 오류 발생:', error);
  }
};

export default gameEndHandler;
