const moment = require("moment");
const redisHelper = require("../utils/redisHelper");

module.exports = async (req, res, next) => {
    
    // Step 1 - 取得 client IP -----------------------------------------------

    // 取得request中資料
    let clientIP = 
        (req.headers["x-forwarded-for"] || "").split(",").pop() ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    clientIP = clientIP.match(/\d+.\d+.\d+.\d+/).join(".")
    
    // 格式化該資料
    clientIP = clientIP.match(/\d+.\d+.\d+.\d+/) ? clientIP.match(/\d+.\d+.\d+.\d+/).join(".") : null;


    // Step 2 - 查詢該IP請求次數 ----------------------------------------------

    // 查詢該IP的請求次數記錄
    let requestResetTime, requestTotalTimes;
    try{
        // 取得請求重置時間
        requestResetTime = await redisHelper.hget(`requestIP: ${clientIP}`, "requestResetTime");
        requestResetTime = requestResetTime ? moment(requestResetTime, "YYYY-MM-DD HH:mm:ss") : undefined;

        // 取得請求次數
        requestTotalTimes = await redisHelper.hget(`requestIP: ${clientIP}`, "requestTotalTimes");
        requestTotalTimes = requestTotalTimes ? Number(requestTotalTimes) : undefined;
    } catch (err) {
        console.log(err);

        return res.status(400).json({
            res: -1,
            msg: "資料庫查詢錯誤"
        })
    }

    // 取得現在時間
    let now = moment();

    // 開始計算本次後的數值
    // 如果曾經訪問
    if(requestResetTime){
        // 如果曾經訪問且已超過歸零時間
        if(now.isAfter(requestResetTime)){
            requestTotalTimes = 1;
            requestResetTime = now.clone().add(1, "hours");
            
        } 
        // 如果曾經訪問但沒超過歸零時間
        else {
            requestTotalTimes += 1;
        }
    } 
    // 第一次訪問
    else {
        requestTotalTimes = 1;
        requestResetTime = now.clone().add(1, "hours");
    }

    // Step 3 - 資料庫紀錄 ----------------------------------------------
    try{
        await redisHelper.hset(`requestIP: ${clientIP}`, "requestResetTime", requestResetTime.format("YYYY-MM-DD HH:mm:ss"));
        await redisHelper.hset(`requestIP: ${clientIP}`, "requestTotalTimes", requestTotalTimes.toString());
    } catch(err) {
        console.log(err);

        return res.status(400).json({
            res: -1,
            msg: "資料庫查詢錯誤"
        })
    }

    // Step 4 - 處理回傳 -----------------------------------------------
    if(requestTotalTimes>1000){
        res.header("X-RateLimit-Reset", requestResetTime.diff(now, "seconds"))
        res.header("X-RateLimit-Remaining", 0)
        return res.status(429).json({
            res: -1,
            msg: "請求次數超過限制"
        })
    } else {
        res.header("X-RateLimit-Reset", requestResetTime.diff(now, "seconds"))
        res.header("X-RateLimit-Remaining", 1000 - requestTotalTimes)
    }


    // Step 5 - 往下一個傳 -----------------------------------------------
    next();

}