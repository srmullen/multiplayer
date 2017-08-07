const redisClient = require("redis");

// const db = redisClient.createClient();
// db.on("error", (err) => {
//     console.error(err);
// });

let db = {};

const redis = {
    hget (hash, key, cb) {
        const obj = db[hash] || {};
        cb(undefined, obj[key]);
        return "ok";
    },
    hset (hash, key, data) {
        const obj = db[hash] || {};
        obj[key] = data;
        db[hash] = obj;
        return "ok";
    },
    flushdb () {
        db = {};
    },
    quit () {console.log("redis qui")}
};

module.exports = redis;
