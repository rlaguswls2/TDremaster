import { PACKET_TYPE, PACKET_TYPE_LENGTH, TOTAL_LENGTH } from '../constants/header.js';
import { getHandlerById } from '../handler/index.js';
import { packetParser } from '../utils/parser/packetParser.js';

export const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);
  const totalHeaderLength = TOTAL_LENGTH + PACKET_TYPE_LENGTH;
  console.log(socket.buffer);
  while (socket.buffer.length > totalHeaderLength) {
    const packetType = socket.buffer.readUInt16BE(0);
    console.log(`packetType: ${packetType}`);

    const versionLength = socket.buffer.readUInt8(2);
    console.log(`versionLength: ${versionLength}`);

    const versionStart = 3;
    const version = socket.buffer.toString('utf8', versionStart, versionStart + versionLength);
    console.log(`version: ${version}`);

    // sequence: 4바이트 읽기
    const sequence = socket.buffer.readUInt32BE(versionStart + versionLength);
    console.log(`sequence: ${sequence}`);

    // payloadLength: 4바이트 읽기
    const payloadLengthPosition = versionStart + versionLength + 4;
    const payloadLength = socket.buffer.readUInt32BE(payloadLengthPosition);
    console.log(`payloadLength: ${payloadLength}`);

    // 패킷의 전체 길이 (헤더와 payload 길이를 포함)
    const length = payloadLengthPosition + 4 + payloadLength;
    console.log('socket.buffer end');
    if (socket.buffer.length >= length) {
      // 헤더부터 끝까지
      const payloadStart = payloadLengthPosition + 4;
      const payload = socket.buffer.subarray(payloadStart, payloadStart + payloadLength);
      console.log(payload); // 데이터가 문자열이라 가정하고 출력

      const packet = socket.buffer.subarray(totalHeaderLength, length);
      socket.buffer = socket.buffer.subarray(length);
      try {
        switch (packetType) {
          case PACKET_TYPE.REGISTER_REQUEST: {
            //console.log(payload);
            packetParser(packet);
            //const { handlerId, userId, payload } = packetParser(packet);
            //console.log(payload.x, payload.y);
            // userId가 존재하는지 확인하고 없으면 추가

            //const handler = getHandlerById(handlerId);
            //handler({ socket, userId, payload });
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
