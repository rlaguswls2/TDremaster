CREATE TABLE IF NOT EXISTS `user`
(
  user_id       INT           PRIMARY KEY AUTO_INCREMENT,
  id            VARCHAR(255)  NOT NULL,
  password      VARCHAR(255)  NOT NULL,
  email         VARCHAR(255)  NOT NULL,
  highest_score INT           DEFAULT 0,
  last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);