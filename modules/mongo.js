var MongoClient = require('mongodb').MongoClient;
// make client connect to mongo service

  async function connectToMongo() {
    return new Promise (function (resolve, reject) {MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }, function (err, db) {
          resolve(db);
    });
});
  }

  async function findByChatid(chatid){
    return new Promise (function (resolve, reject) { connectToMongo().then(db =>{
    var dbase = db.db("newdb");
    dbase.collection("orders").find({chatid: chatid.toString()}).sort({ordernumber:-1}).limit(1).toArray(function (err, result) {
        if (err) throw err;
        db.close();
        const resultResponse = result;
        console.log("Debug findOrdernumber "+ resultResponse);
        if (resultResponse != undefined && resultResponse != null && resultResponse != "") {
          console.log("order if")
          resolve(parseInt(resultResponse[0].ordernumber) + 1);
        } else {
          resolve(0);
        }
      });
    });
  });
}


  function findOrders(bot,chatId){
     connectToMongo().then(db =>{
        var dbase = db.db("newdb");
        console.log(chatId);
        let query = {
          chatid: chatId + ""
        }
        dbase.collection("orders").find(query).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            result.forEach(function (element, index) {
              bot.sendMessage(chatId, "ordine n° " + index + " : " + element.message);
            });
    
        });
     });
    
  }

  module.exports = {  findOrders, findByChatid,connectToMongo};