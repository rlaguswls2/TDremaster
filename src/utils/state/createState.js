import { GAME_STATE } from '../../constants/gameState.js';
import { getProtoMessages } from '../../init/loadProto.js';

export const createInitialGameState = () => {
  const protoMessages = getProtoMessages();
  const InitialGameState = protoMessages.test.InitialGameState;
  const initialGameState = InitialGameState.create({
    baseHp: GAME_STATE.BASE_HP,
    towerCost: GAME_STATE.TOWER_COST,
    initialGold: GAME_STATE.INITIAL_GOLD,
    monsterSpawnInterval: GAME_STATE.MONSTER_SPAWN_INTERVAL,
  });

  return initialGameState;
};

export const createGameState = () => {
  const protoMessages = getProtoMessages();
  const GameState = protoMessages.test.GameState;
  const TowerData = protoMessages.test.TowerData;
  const MonsterData = protoMessages.test.MonsterData;
  const Position = protoMessages.test.Position;
  const BaseData = protoMessages.test.BaseData;

  const gameState = GameState.create({
    gold: 1000,
    base: BaseData.create({ hp: 100, maxHp: 100 }),
    highScore: 0,
    towers: [
      TowerData.create({ towerId: 1, x: 0, y: 0 }),
      TowerData.create({ towerId: 2, x: 1, y: 1 }),
      TowerData.create({ towerId: 3, x: 2, y: 2 }),
    ],
    monsters: [MonsterData.create({ monsterId: 1, monsterNumber: 1, level: 1 })],
    monsterLevel: 1,
    score: 0,
    monsterPath: [
      Position.create({ x: 0, y: 0 }),
      Position.create({ x: 1, y: 1 }),
      Position.create({ x: 2, y: 2 }),
      Position.create({ x: 3, y: 3 }),
    ],
    basePosition: Position.create({ x: 0, y: 0 }),
  });

  return gameState;
};
