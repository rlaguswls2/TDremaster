# TDremaster

---

## 8조

---

#### 프로젝트 제작 기간 : 2024.11.04(월) ~ 2024.11.12(화)

---

## 목차<br>

[1. 개발 환경](#개발-환경)<br>
[2. 와이어 프레임](#와이어-프레임)<br>
[3. 패킷 명세서](#패킷-명세서)<br>
[4. ERD 다이어그램](#erd-다이어그램)<br>
[5. 구현 기능](#구현-기능)<br>
[6. 폴더 구조](#폴더-구조)<br>
[7. 팀 노션](#팀-노션)<br>
[8. 프로젝트 제작 인원](#프로젝트-제작-인원)<br>

---

### 프로젝트 구성

#### 개발 환경

1. 개발 환경
   - 개발 툴 : VS-Code
   - 협업 : GitHub
1. 프로그램 언어
   - Node.js
   - JavaScript
1. 프레임 워크
   - Express
1. 데이터 베이스
   - MySQL
1. 패키지 관리자
   - npm

---

#### 와이어 프레임

![image](https://github.com/user-attachments/assets/d4c41264-309a-4621-97d6-6036116bb5a7)

---

#### 패킷 명세서

![pak1](https://github.com/user-attachments/assets/19f43c7e-11d1-42d1-8780-4c287bc26ddb)
![pak2](https://github.com/user-attachments/assets/8e0bdc44-2eb6-4a86-a233-1f5ad85e9094)
![pak3](https://github.com/user-attachments/assets/fc24aaba-e5a1-4f7d-b622-934dd4197d81)
![pak4](https://github.com/user-attachments/assets/744f69b7-631c-4110-a6fe-3070ea32a3ce)

---

#### ERD 다이어그램

![image](https://github.com/user-attachments/assets/3fb39342-abdc-4109-b31c-bad6d99a6ffa)

---

### 구현 기능

- 2인의 멀티플레이가 지원되는 타워 디펜스 게임입니다.<br>

1. 회원가입<br>이메일, 아이디, 비밀번호, 비밀번호 확인을 입력받고 해당 값을 데이터 테이블에 저장합니다.
1. 로그인<br>저장되어있는 아이디, 비밀번호 값을 받아 문제가 없다면 jwt토큰을 생성합니다.
1. 게임 시작<br>게임 시작 버튼 클릭 시 매칭이 시작되고 시작 버튼을 누른 플레이어가 2명이 될 시 게임이 진행됩니다.
1. 게임 오버<br>몬스터가 기지에 닿을 시 기지의 HP가 감소하고 기지의 HP가 0이 되거나 게임을 종료하면 해당 플레이어가 DEFEAT, 상대 플레이어가 VICTORY이미지가 띄워집니다. 이후 클릭시 게임이 종료됩니다.
1. 타워 구매<br>타워 구매 버튼을 누르면 버튼을 누른 플레이어의 보유 골드량을 감소시키고 타워가 배치됩니다.

<br>
1. S2CMatchStartNotification(선택) - 구현 완료<br>
1. C2SGameEndRequest(선택) - 구현 완료<br>
1. S2CStateSyncNotification(선택) - 구현 완료<br>

---

### 폴더 구조<br>

📦TDremaster<br>
┣ 📂.git<br>
┣ 📂node_modules<br>
┣ 📂src<br>
┃ ┣ 📂config<br>
┃ ┃ ┗ 📜config.js<br>
┃ ┣ 📂constants<br>
┃ ┃ ┣ 📜env.js<br>
┃ ┃ ┣ 📜gameState.js<br>
┃ ┃ ┗ 📜header.js<br>
┃ ┣ 📂db<br>
┃ ┃ ┣ 📂migrations<br>
┃ ┃ ┃ ┗ 📜createSchema.js<br>
┃ ┃ ┣ 📂sql<br>
┃ ┃ ┃ ┗ 📜user_db.sql<br>
┃ ┃ ┣ 📂user<br>
┃ ┃ ┃ ┣ 📜user.db.js<br>
┃ ┃ ┃ ┗ 📜user.queries.js<br>
┃ ┃ ┗ 📜database.js<br>
┃ ┣ 📂events<br>
┃ ┃ ┣ 📜onConnection.js<br>
┃ ┃ ┣ 📜onData.js<br>
┃ ┃ ┣ 📜onEnd.js<br>
┃ ┃ ┗ 📜onError.js<br>
┃ ┣ 📂handler<br>
┃ ┃ ┣ 📂auth<br>
┃ ┃ ┃ ┣ 📜login.handler.js<br>
┃ ┃ ┃ ┗ 📜register.handler.js<br>
┃ ┃ ┣ 📂game<br>
┃ ┃ ┃ ┣ 📂notification<br>
┃ ┃ ┃ ┃ ┗ 📜sendNotification.js<br>
┃ ┃ ┃ ┣ 📜gameOver.handler.js<br>
┃ ┃ ┃ ┣ 📜match.handler.js<br>
┃ ┃ ┃ ┣ 📜monsterAttackBase.handler.js<br>
┃ ┃ ┃ ┣ 📜monsterDeath.handler.js<br>
┃ ┃ ┃ ┣ 📜spawnMonster.handler.js<br>
┃ ┃ ┃ ┣ 📜towerAttack.handler.js<br>
┃ ┃ ┃ ┗ 📜towerPurchase.handler.js<br>
┃ ┃ ┗ 📜index.js<br>
┃ ┣ 📂init<br>
┃ ┃ ┣ 📜index.js<br>
┃ ┃ ┗ 📜loadProto.js<br>
┃ ┣ 📂protobuf<br>
┃ ┃ ┣ 📜packetNames.js<br>
┃ ┃ ┗ 📜test.proto<br>
┃ ┣ 📂sessions<br>
┃ ┃ ┣ 📜game.session.js<br>
┃ ┃ ┣ 📜sessions.js<br>
┃ ┃ ┗ 📜user.session.js<br>
┃ ┣ 📂utils<br>
┃ ┃ ┣ 📂db<br>
┃ ┃ ┃ ┗ 📜highScoreUpdate.js<br>
┃ ┃ ┣ 📂notification<br>
┃ ┃ ┃ ┗ 📜game.notification.js<br>
┃ ┃ ┣ 📂response<br>
┃ ┃ ┃ ┗ 📜createResponse.js<br>
┃ ┃ ┣ 📂state<br>
┃ ┃ ┃ ┗ 📜createState.js<br>
┃ ┃ ┣ 📜dateFomatter.js<br>
┃ ┃ ┣ 📜serializer.js<br>
┃ ┃ ┗ 📜transformCase.js<br>
┃ ┗ 📜server.js<br>
┣ 📜.env<br>
┣ 📜.gitattributes<br>
┣ 📜.gitignore<br>
┣ 📜.prettierrc<br>
┣ 📜package-lock.json<br>
┣ 📜package.json<br>
┗ 📜README.md<br>

---

### 팀 노션<br>

## [8bit Gaming](https://www.notion.so/teamsparta/8bit-Gaming-f3722101964b4b0d83d9b22ffe19d6ba#1232dc3ef514817ca723e18284e8c0ea)<br>

### 프로젝트 제작 인원<br>

- [최성원](https://github.com/DudeKYH 'Github') [김선우](https://github.com/Rien3844 'Github') [김현진](https://github.com/rlaguswls2 'Github')<br>
  [이진욱](https://github.com/adfio1234 'Github') [이의현](https://github.com/UIHyeonLEE 'Github') [이상현](https://github.com/LeeSanghyun1212 'Github')<br>
