import { getProtoMessages } from "../../init/loadProto.js";
import { createTowerId } from "./towerPurchase.handler.js";

const towerAttack = ({socket, payload}) => {
    var towerId = createTowerId();
    try{
        const protoMessages = getProtoMessages();

        const GamePacket = protoMessages.test.GamePacket;
        const gamePacket = GamePacket.decode(payload);
        console.log(`Decoded GamePacket:`, gamePacket);

        const towerAttackRequest = gamePacket.towerAttackRequest;
        const { towerId, monsterId } = towerAttackRequest;
        if(!towerAttackRequest){
            throw new Error('Invalid payload type in GamePacket for towerAttack request.');
        }

        const S2CEnemyTowerAttackNotification = protoMessages.test.S2CEnemyTowerAttackNotification;
    }catch(e){
        console.error(e);
    }
}

export default towerAttack;