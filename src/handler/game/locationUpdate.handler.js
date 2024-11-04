import { getGameSession } from '../../sessions/game.session.js';

const locationUpdateHandler = ({ socket, userId, payload }) => {
  try {
    const { x, y } = payload;
    const gameSession = getGameSession();
    if (!gameSession) {
      console.error('Game session not found');
    }

    const user = gameSession.getUser(userId);
    if (!user) {
      console.error('User not found');
    }

    user.updatePosition(x, y);

    const locationData = gameSession.getAllLocation(userId);

    socket.write(locationData);
  } catch (error) {
    console.error(error);
  }
};

export default locationUpdateHandler;
