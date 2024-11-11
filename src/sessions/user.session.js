import { activePlayers, matchQueue } from './sessions.js';
import { findHighScoreById } from '../db/user/user.db.js';
import { userHighScore } from './sessions.js';

export class UserState {
  constructor(socket, id) {
    this.id = id;
    this.socket = socket;
    this.highScore = 0;
  }

  async setHighScore() {
    this.highScore = await findHighScoreById(this.id);
  }
}

export const getHighScore = (socket) => {
  for (let i = 0; i < userHighScore.length; i++) {
    if (userHighScore[i].socket === socket) {
      return userHighScore[i];
    }
  }
};

export const removeHighScoreState = (socket) => {
  for (let i = 0; i < userHighScore.length; i++) {
    if (userHighScore[i].socket === socket) {
      return userHighScore.splice(i, 1);
    }
  }
};

function addToMatchQueue(player) {
  matchQueue.push(player);
}

function getMatchPlayers() {
  if (matchQueue.length >= 2) {
    const [playerA, playerB] = matchQueue.splice(0, 2); // 소켓 전달
    activePlayers.push({ playerA, playerB });
    return { playerA, playerB };
  }
  return null;
}

function getOpponentSocket(playerSocket) {
  for (let i = 0; i < activePlayers.length; i++) {
    if (activePlayers[i].playerA === playerSocket) return activePlayers[i].playerB;
    if (activePlayers[i].playerB === playerSocket) return activePlayers[i].playerA;
  }
}

function clearMatch(playerSocket) {
  for (let i = 0; i < activePlayers.length; i++) {
    if (activePlayers[i].playerA === playerSocket || activePlayers[i].playerB === playerSocket) {
      return activePlayers.splice(i, 1);
    }
  }
}

export { addToMatchQueue, getMatchPlayers, getOpponentSocket, clearMatch };
