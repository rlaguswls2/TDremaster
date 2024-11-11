import { toCamelCase } from '../../utils/transformCase.js';
import dbPool from '../database.js';
import { USER_QUERIES } from './user.queries.js';

export const findUserById = async (id) => {
  const [rows] = await dbPool.query(USER_QUERIES.FIND_USER_BY_ID, [id]);
  if(rows.length===0)//id가 존재하지않으면 null리턴
  {
    return null;
  }
  return toCamelCase(rows[0]);
};

export const createUser = async (email,id,password) => {
  console.log("createUser:",email,id,password);
  await dbPool.query(USER_QUERIES.CREATE_USER, [email,id,password]);
  return { email,id,password };
};

export const updateUserLogin = async (id) => {
  await dbPool.query(USER_QUERIES.UPDATE_USER_LOGIN, [id]);
};

export const updateUserLocation = async (x, y, deviceId) => {
  await dbPool.query(USER_QUERIES.UPDATE_USER_LOCATION, [x, y, deviceId]);
};
//유저의 하이스코어를 갱신하는 코드
export const updateUserHighScore =async(highScore,id)=>{
  await dbPool.query(USER_QUERIES.UPDATE_HIGHEST_SCORE, [highScore, id]);
};
//highScore불러오는 함수 id를 비교해서 db에 저장된 highest_score을 불러온다.
export const findHighScore = async (id) => {
  const [rows] = await dbPool.query(USER_QUERIES.FIND_USER_BY_ID, [id]);
  if(rows.length===0)//id가 여러개면 null리턴
  {
    return null;
  }
  return rows[0].highest_score;
};
