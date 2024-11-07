// 기지 공격 핸들러
const monsterAttackBaseHandler = (packet) => {
  const { damage } = packet;

  // 기지 HP 감소
  baseState.hp -= damage;

  const baseState = getBaseState(); // 기지 상태를 가져오는 가상의 함수
  baseState.hp -= damage; // 기지 HP 감소

  if (baseState.hp <= 0) {
    console.log('기지가 파괴되었습니다! 게임 오버!');

    handleGameOver();
  } else {
    console.log(`기지에 대한 공격, 피해량: ${damage}. 남은 HP: ${baseState.hp}`);
  }
};

// 기지 상태를 가져오는 가상의 함수
const getBaseState = () => {
  return {
    hp: 100,
  };
};

const handleGameOver = () => {
  console.log('게임이 종료되었습니다.');
};

export default monsterAttackBaseHandler;
