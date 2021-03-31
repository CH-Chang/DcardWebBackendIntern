# Dcard Web Backend Intern HW - Dcard 後端實習作業

### 專案要求

本專案為申請 2021 Dcard 後端實習之作業，完成其作業要求含

- Dcard 每天午夜都有大量使用者湧入抽卡，為了不讓伺服器過載，請設計一個 middleware
- 限制每小時來自同一個 IP 的請求數量不得超過 1000
- 在 response headers 中加入剩餘的請求數量 (X-RateLimit-Remaining) 以及 rate limit 歸零的時間 (X-RateLimit-Reset)
- 如果超過限制的話就回傳 429 (Too Many Requests)
- 可以使用各種資料庫達成

---

### 專案架構與說明

本專案主要採用 Express JS 作為實作框架，並使用 Redis 鍵值對儲存資料庫做為資料的紀錄與儲存。專案之結構如下方所示

- **configs: 配置文件資料夾**
  - redisConfig.js: Redis 資料庫相關配置資料
- **controllers: 路由接口實現內容資料夾**
  - serviceController.js: service 路由接口之主要實現內容
- **middleware: 中間件資料夾**
  - preventOverloadMiddleware.js: 本次作業要求之 middleware
- **models: 資料庫模型資料夾**
- **routes: 路由資料夾**
  - serviceRouter.js: service 路由接口配置
- **utils: 工具資料夾**
  - redisHelper.js: 封裝 Redis 工具
- app.js: 應用程式配置

---

### 運行專案

```
# clone 專案至本地
git clone https://github.com/CH-Chang/DcardWebBackendIntern.git
# 切換至專案目錄
cd (project dir)
# 安裝專案依賴庫
npm i
# 啟動專案
npm start

# 專案啟動網址 http://localhost:3000
# 作業接口網址 GET http://localhost:3000/api/service/card
```

---
