import { CLIENT_VERSION } from '../constants/env.js';
import { PACKET_TYPE_LENGTH, TOTAL_LENGTH, VERSION_START } from '../constants/header.js';

export const serializer = (message, packetType, sequence = 1) => {
  // packetType (2 bytes)
  const packetTypeBuffer = Buffer.alloc(2);
  packetTypeBuffer.writeUInt16BE(packetType, 0);

  // versionLength (1 byte)
  const versionLengthBuffer = Buffer.alloc(1);
  versionLengthBuffer.writeUInt8(CLIENT_VERSION.length, 0);

  // version (string to buffer)
  const versionBuffer = Buffer.from(CLIENT_VERSION, 'utf8');

  // sequence (4 bytes)
  const sequenceBuffer = Buffer.alloc(4);
  sequenceBuffer.writeUInt32BE(sequence, 0);

  // payloadLength (4 bytes)
  const payloadLengthBuffer = Buffer.alloc(4);
  payloadLengthBuffer.writeUInt32BE(message.length, 0);

  // 최종 패킷 결합 (header + message)
  return Buffer.concat([
    packetTypeBuffer,
    versionLengthBuffer,
    versionBuffer,
    sequenceBuffer,
    payloadLengthBuffer,
    message,
  ]);
};
