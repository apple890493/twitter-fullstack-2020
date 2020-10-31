# Simple Twitter
### 一個仿twitter模式的論壇，使用者可以註冊個人帳戶、登入登出、貼文留言、追蹤使用者、Like推文、編輯修改個人資訊，管理者可以瀏覽與刪除推文並查看所有使用者的狀態。

### 使用者介面([Figma](https://www.figma.com/file/WfushzZVXyVwQK0SafjTmB/ACCapstone%3A-Twitter-Wireframe?node-id=0%3A1))

![image](https://github.com/CoreyHuang/twitter-fullstack/blob/f/addReadme/twitter-wireframe.png)

---

### installation and execution(安裝與執行步驟):
#### `<安裝步驟>`
#### 1. 安裝git
#### 2. 安裝nvm (node管控工具)
#### 3. 安裝node.js與設定版本
```
nvm install 10.15.0
nvm use 10.15.0
```
#### 4. 安裝npm nodemon
```
npm install -g nodemon
```

#### `<執行步驟>`
#### 1. 使用terminal下載專案
```
git clone https://github.com/CoreyHuang/twitter-fullstack.git
```
#### 2. 安裝npm套件(package.json)
```
npm install
```
#### 3. 環境變數設定
```
cp .env.example .env
```
#### 4. 載入種子資料(MySQL)
```
npm run seed
```
#### 5. 開啟本地伺服(專案資料夾中)
```
nodemon app.js or npm run dev
```
#### 6. 執行
```
URL: http://localhost:3000/
```

### Test Account
|Account|Password|
|:-----:|:------:|
|root|12345678|
|user1|12345678|
|user2|12345678|
|user3|12345678|


### Prerequisites(環境建置與需求):
#### `<安裝需求>`
 1. git : v2.27.0.windows.1
 2. nvm : v1.1.7
 3. node : v10.15.0
 4. npm : v6.4.1
 5. nodemon : v2.0.4
#### `<npm套件>`
 1. express : v4.16.4
 2. express-handlebars : v3.0.0
 3. body-parser : v1.19.0
 4. method-override : v3.0.0
 5. bcryptjs : v2.4.3
 6. connect-flash : v0.1.1
 7. dotenv : v8.2.0
 8. express-session : v1.15.6
 9. passport : v0.4.0
 10. passport-local : v1.0.0
 11. faker : v4.1.0
 12. imgur-node-api : v0.1.0
 13. multer : v1.4.2
 14. mysql2 : v1.6.4
 15. socket.io : v2.3.0
 16. sequelize : v4.42.0
 17. sequelize-cli : v5.5.0
 18. moment : v2.29.0