import { PACKET_NUMBER } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { serializer } from '../serializer.js';

const sendResponsePacket = (socket, packetType, responseMessage) => {
  try {
    const protoMessages = getProtoMessages();
    const GamePacket = protoMessages.test.GamePacket;

    const responseGamePacket = GamePacket.create(responseMessage);
    const gamePacketBuffer = GamePacket.encode(responseGamePacket).finish();

    const serializedPacket = serializer(gamePacketBuffer, packetType);
    socket.write(serializedPacket);

    console.log(`Sent packet of type ${PACKET_NUMBER[packetType]} to client.`);
  } catch (error) {
    console.error('Error sending response packet', error);
  }
};

export default sendResponsePacket;
