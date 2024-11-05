import {
  PACKET_TYPE,
  PACKET_TYPE_LENGTH,
  PAYLOAD_LENGTH_SIZE,
  TOTAL_LENGTH,
  VERSION_START,
} from '../constants/header.js';
import { getHandlerByPacketType } from '../handler/index.js';
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

    const version = socket.buffer.toString('utf8', VERSION_START, VERSION_START + versionLength);
    console.log(`version: ${version}`);

    // sequence: 4바이트 읽기
    const sequence = socket.buffer.readUInt32BE(VERSION_START + versionLength);
    console.log(`sequence: ${sequence}`);

    // payloadLength: 4바이트 읽기
    const payloadLengthPosition = VERSION_START + versionLength + PAYLOAD_LENGTH_SIZE;
    const payloadLength = socket.buffer.readUInt32BE(payloadLengthPosition);
    console.log(`payloadLength: ${payloadLength}`);

    // 패킷의 전체 길이 (헤더와 payload 길이를 포함)
    const length = payloadLengthPosition + PAYLOAD_LENGTH_SIZE + payloadLength;
    if (socket.buffer.length >= length) {
      // 헤더부터 끝까지
      const payloadStart = payloadLengthPosition + PAYLOAD_LENGTH_SIZE;
      let payload = socket.buffer.subarray(payloadStart, payloadStart + payloadLength);

      socket.buffer = socket.buffer.subarray(length);
      try {
        const handler = getHandlerByPacketType(packetType);
        handler({ socket, payload });
      } catch (error) {
        console.error(error);
      }
    } else {
      break;
    }
  }
};
