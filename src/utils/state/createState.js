import { GAME_STATE } from '../../constants/gameState.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { getPlayerState } from '../../sessions/game.session.js';

export const createInitialGameState = () => {
  const protoMessages = getProtoMessages();
  const InitialGameState = protoMessages.test.InitialGameState;

  const initialGameState = InitialGameState.create({
    baseHp: GAME_STATE.INITIAL_BASE_HP,
    towerCost: GAME_STATE.TOWER_COST,
    initialGold: GAME_STATE.INITIAL_GOLD,
    monsterSpawnInterval: GAME_STATE.MONSTER_SPAWN_INTERVAL,
  });

  return initialGameState;
};

export const createGameStateData = (socket) => {
  const protoMessages = getProtoMessages();
  const GameState = protoMessages.test.GameState;
  const MonsterData = protoMessages.test.MonsterData;
  const Position = protoMessages.test.Position;
  const BaseData = protoMessages.test.BaseData;

  // getPlayerState 함수를 통해 기존의 PlayerState 가져오기
  const playerState = getPlayerState(socket);
  if (!playerState) {
    console.error('플레이어 상태를 가져오지 못했습니다.');
    return null;
  }

  // GameState 초기화
  const gameState = GameState.create({
    gold: playerState.userGold,
    base: BaseData.create({ hp: playerState.baseHp, maxHp: playerState.maxHp }),
    highScore: playerState.highScore,
    towers: playerState.towers,
    monsters: playerState.monsterData,
    monsterLevel: playerState.monsterLevel,
    score: playerState.score,
    monsterPath: [
      Position.create({ x: 100, y: 300 }),
      Position.create({ x: 400, y: 350 }),
      Position.create({ x: 700, y: 250 }),
      Position.create({ x: 1000, y: 350 }),
      Position.create({ x: 1200, y: 250 }),
      Position.create({ x: 1400, y: 300 }),
    ],
    basePosition: Position.create({ x: 1400, y: 350 }),
  });

  return gameState;
};
