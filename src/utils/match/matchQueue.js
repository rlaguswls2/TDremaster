// matchQueue.js - 매칭 큐 관리
const matchQueue = [];
// const activePlayers = { playerA: null, playerB: null };
const activePlayers = [];

function addToMatchQueue(player) {
  matchQueue.push(player);
}

// function getMatchPlayers() {
//   if (matchQueue.length >= 2) {
//     const [playerA, playerB] = matchQueue.splice(0, 2); // 소켓 전달
//     activePlayers.playerA = playerA;
//     activePlayers.playerB = playerB;
//     return { playerA, playerB };
//   }
//   return null;
// }

function getMatchPlayers() {
  if (matchQueue.length >= 2) {
    const [playerA, playerB] = matchQueue.splice(0, 2); // 소켓 전달
    activePlayers.push({ playerA, playerB });
    return { playerA, playerB };
  }
  return null;
}

// function getOpponentSocket(playerSocket) {
//   return activePlayers.playerA === playerSocket ? activePlayers.playerB : activePlayers.playerA;
// }

function getOpponentSocket(playerSocket) {
  for (let i = 0; i < activePlayers.length; i++) {
    if (activePlayers[i].playerA === playerSocket) return activePlayers[i].playerB;
    if (activePlayers[i].playerB === playerSocket) return activePlayers[i].playerA;
  }
}

// function clearMatch() {
//   activePlayers.playerA = null;
//   activePlayers.playerB = null;
// }

function clearMatch(playerSocket) {
  for (let i = 0; i < activePlayers.length; i++) {
    if (activePlayers[i].playerA === playerSocket || activePlayers[i].playerB === playerSocket) {
      activePlayers.splice(i, 1);
    }
  }
}

export { addToMatchQueue, clearMatch, getMatchPlayers, getOpponentSocket };
