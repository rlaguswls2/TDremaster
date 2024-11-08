import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import sendResponsePacket from '../../utils/response/createResponse.js';

var towerId = 0;

const towerPurchase = ({ socket, payload }) => {
  try {
    const protoMessages = getProtoMessages();

    const GamePacket = protoMessages.test.GamePacket;
    const gamePacket = GamePacket.decode(payload);
    console.log(`Decoded GamePacket:`, gamePacket);

    const towerPurchaseRequest = gamePacket.towerPurchaseRequest;
    if (!towerPurchaseRequest) {
      throw new Error('Invalid payload type in GamePacket for towerPurchase request.');
    }

    const { x, y } = towerPurchaseRequest;
    console.log(`in towerPurchaseHandler.js data : ${x}, ${y}`);

    const towerId = createTowerId();

    // S2CTowerPurchaseResponse 메시지 생성 및 직렬화
    const S2CTowerPurchaseResponse = protoMessages.test.S2CTowerPurchaseResponse;
    const responsePayload = S2CTowerPurchaseResponse.create({ towerId });

    sendResponsePacket(socket, PACKET_TYPE.TOWER_PURCHASE_RESPONSE, {
      towerPurchaseResponse: responsePayload,
    });
  } catch (e) {
    console.error(e);
  }
};

export const createTowerId = () => {
  return towerId++;
};

export const generateTowerIds = (count) => {
  const ids = [];
  for (let i = 0; i < count; i++) {
    ids.push(createTowerId()); // createTowerId로 생성한 ID를 배열에 추가
  }
  return ids;
};
export default towerPurchase;
