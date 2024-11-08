export const USER_QUERIES = {
  FIND_USER_BY_ID: 'SELECT * FROM user WHERE id = ?',//id조회를 위한 쿼리로 수정
  CREATE_USER: 'INSERT INTO user (email, id, password) VALUES (?, ?, ?)',
  UPDATE_USER_LOGIN: 'UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE id = ?',//last login 수정
  UPDATE_USER_LOCATION: 'UPDATE user SET x_coord = ?, y_coord = ? WHERE device_id = ?',
};
