var redis = require("redis"),
    client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

var testcases = [];
var maxOp = 100 * 100 * 10;


for (var i = 0; i < maxOp; i++) {
    testcases.push({
        key: "key_" + i,
        value: "value_" + i
    })
}

var completeFlag = maxOp;
var startTime = +new Date(), total, endTime;

client.on("ready", function (error, replay) {
    if (!error) {
        console.log("Redis ready!");
    }
    client.flushdb(function (error, replay) {
        if (!error) {
            console.log("Redis flush!");
        }

        var multi = client.multi();

        testcases.forEach(function (ca) {
            multi.set(ca.key, ca.value);
        });

        multi.exec(function (err, replies) {

            endTime = +new Date();
            total = (endTime - startTime) / 1000;

            console.log("Redis total cost: " + total + "s", maxOp / total + " o/s");
            process.exit();            
        });
    })   
});