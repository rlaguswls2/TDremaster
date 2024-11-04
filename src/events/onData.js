import {
  INITIAL_LOCATION_X,
  INITIAL_LOCATION_Y,
  PACKET_TYPE,
  PACKET_TYPE_LENGTH,
  TOTAL_LENGTH,
} from '../constants/header.js';
import { getHandlerById } from '../handler/index.js';
import { packetParser } from '../utils/parser/packetParser.js';

export const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);
  const totalHeaderLength = TOTAL_LENGTH + PACKET_TYPE_LENGTH;

  while (socket.buffer.length > totalHeaderLength) {
    const length = socket.buffer.readUInt32BE(0);
    const packetType = socket.buffer.readUInt8(TOTAL_LENGTH);

    if (socket.buffer.length >= length) {
      // 헤더부터 끝까지
      const packet = socket.buffer.subarray(totalHeaderLength, length);
      socket.buffer = socket.buffer.subarray(length);
      try {
        switch (packetType) {
          case PACKET_TYPE.NORMAL: {
            // 패킷 파서
            const { handlerId, userId, payload } = packetParser(packet);
            //console.log(payload.x, payload.y);
            // userId가 존재하는지 확인하고 없으면 추가

            const handler = getHandlerById(handlerId);
            handler({ socket, userId, payload });
          }
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      break;
    }
  }
};
