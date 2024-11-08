import { getProtoMessages } from "../../init/loadProto.js";
// import { createTowerId } from "./towerPurchase.handler.js";
// import { generateUniqueMonsterId } from "./spawnMonster.handler.js"
import sendResponsePacket from '../../utils/response/createResponse.js';
import { PACKET_TYPE } from "../../constants/header.js";

const towerAttack = ({socket, payload}) => {
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
        console.log(`tower ${towerId}, moster ${monsterId}`);
        const S2CEnemyTowerAttackNotification = protoMessages.test.S2CEnemyTowerAttackNotification;
        const A_EnemyTowerAttackNotification = S2CEnemyTowerAttackNotification.create({
            towerId: towerId,
            monsterId: monsterId,
        })
        const B_EnemyTowerAttackNotification = S2CEnemyTowerAttackNotification.create({
            towerId: towerId,
            monsterId: monsterId,
        })
        sendResponsePacket(socket, PACKET_TYPE.ENEMY_TOWER_ATTACK_NOTIFICATION, {
            enemyTowerAttackNotification: A_EnemyTowerAttackNotification,
        });
        sendResponsePacket(socket, PACKET_TYPE.ENEMY_TOWER_ATTACK_NOTIFICATION, {
            enemyTowerAttackNotification: B_EnemyTowerAttackNotification,
        });//socket값 player로
    }catch(e){
        console.error(e);
    }
}

export default towerAttack;