import { PACKET_TYPE, PACKET_TYPE_LENGTH, TOTAL_LENGTH } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';

const serializer = (message, type) => {
  const packetLength = Buffer.alloc(TOTAL_LENGTH);
  packetLength.writeUint32BE(message.length + TOTAL_LENGTH + PACKET_TYPE_LENGTH, 0);

  const packetType = Buffer.alloc(PACKET_TYPE_LENGTH);
  packetType.writeUInt8(type, 0);

  return Buffer.concat([packetLength, packetType, message]);
};

export const createLocationPacket = (users) => {
  const protoMessage = getProtoMessages();
  const location = protoMessage.gameNotification.LocationUpdate;

  const payload = { users };
  const message = location.create(payload);
  const locationPacket = location.encode(message).finish();

  return serializer(locationPacket, PACKET_TYPE.LOCATION);
};

export const createPingPacket = (timestamp) => {
  const protoMessage = getProtoMessages();
  const location = protoMessage.common.Ping;

  const payload = { timestamp };
  const message = location.create(payload);
  const pingPacket = location.encode(message).finish();

  return serializer(pingPacket, PACKET_TYPE.PING);
};
