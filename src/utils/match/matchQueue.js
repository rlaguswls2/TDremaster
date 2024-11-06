// matchQueue.js - 매칭 큐 관리
const matchQueue = [];

function addToMatchQueue(player) {
  matchQueue.push(player);
}

function getMatchPlayers() {
  if (matchQueue.length >= 2) {
    return matchQueue.splice(0, 2); // 두 명을 매칭하여 큐에서 제거
  }
  return null;
}

export { addToMatchQueue, getMatchPlayers };
