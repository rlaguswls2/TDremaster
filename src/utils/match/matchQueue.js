// matchQueue.js - 매칭 큐 관리
const matchQueue = [];
const activePlayers = { playerA: null, playerB: null };

export const user = {
  socket: socket,
  baseHp: INTIAL_BASE_HP,
};

user.baseHp = user.baseHp - damage;

function addToMatchQueue(player) {
  matchQueue.push(player);
}

function getMatchPlayers() {
  if (matchQueue.length >= 2) {
    const [playerA, playerB] = matchQueue.splice(0, 2); // 소켓 전달
    activePlayers.playerA = playerA;
    activePlayers.playerB = playerB;
    return { playerA, playerB };
  }
  return null;
}

function getOpponentSocket(playerSocket) {
  return activePlayers.playerA === playerSocket ? activePlayers.playerB : activePlayers.playerA;
}

function clearMatch() {
  activePlayers.playerA = null;
  activePlayers.playerB = null;
}

export { addToMatchQueue, clearMatch, getMatchPlayers, getOpponentSocket };
