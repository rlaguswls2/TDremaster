// matchQueue.js - 매칭 큐 관리
const matchQueue = [];
const activePlayers = [];

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
      activePlayers.splice(i, 1);
    }
  }
}

export { addToMatchQueue, clearMatch, getMatchPlayers, getOpponentSocket };
