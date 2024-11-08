import { toCamelCase } from '../../utils/transformCase.js';
import dbPool from '../database.js';
import { USER_QUERIES } from './user.queries.js';

export const findUserById = async (id) => {
  const [rows] = await dbPool.query(USER_QUERIES.FIND_USER_BY_ID, [id]);
  if(rows.length===0)///null이 return 되면 중복이 없다는 뜻.
  {
    return null;
  }
  return toCamelCase(rows[0]);
};

export const createUser = async (email,id,password) => {
  console.log("createUddddser:",email,id,password);
  await dbPool.query(USER_QUERIES.CREATE_USER, [email,id,password]);
  return { email,id,password };
};

export const updateUserLogin = async (deviceId) => {
  await dbPool.query(USER_QUERIES.UPDATE_USER_LOGIN, [deviceId]);
};

export const updateUserLocation = async (x, y, deviceId) => {
  await dbPool.query(USER_QUERIES.UPDATE_USER_LOCATION, [x, y, deviceId]);
};
