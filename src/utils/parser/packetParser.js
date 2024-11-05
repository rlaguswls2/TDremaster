import { CLIENT_VERSION } from '../../constants/env.js';
import { getProtoTypeNameByHandlerId } from '../../handler/index.js';
import { getProtoMessages } from '../../init/loadProto.js';

export const packetParser = (payload) => {
  const protoMessages = getProtoMessages();

  const Packet = protoMessages.test.C2SRegisterRequest;
  console.log(`in packetParser.js Packet: ${Packet}`);
  let packet;
  console.log(`in packetParser.js data: ${payload}`);
  try {
    packet = Packet.decode(payload);
    console.log(`in packetParser.js packet: ${packet}`);
  } catch (error) {
    console.error(error);
  }

  // const handlerId = packet.handlerId;
  // const userId = packet.userId;
  // const clientVersion = packet.version;

  // if (clientVersion !== CLIENT_VERSION) {
  //   throw Error();
  // }
  // const protoTypeName = getProtoTypeNameByHandlerId(handlerId);
  // if (!protoTypeName) {
  //   throw Error();
  // }

  // const [namespace, typeName] = protoTypeName.split('.');
  // const payloadType = protoMessages[namespace][typeName];
  // let payload;

  // try {
  //   payload = payloadType.decode(packet.payload);
  // } catch (error) {
  //   console.error(error);
  // }

  // const expectedFields = Object.keys(payloadType.fields);
  // const actualFields = Object.keys(payload);
  // const missingFields = expectedFields.filter((field) => !actualFields.includes(field));

  // if (missingFields > 0) {
  //   throw Error();
  // }

  // return { handlerId, userId, payload };
};
