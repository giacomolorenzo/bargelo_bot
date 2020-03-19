var MongoClient = require('mongodb').MongoClient;
// make client connect to mongo service

MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, function (err, db) { //here db is the client obj
    if (err) throw err;
    dbase = db.db("newdb"); //here
    dbase.createCollection("orders", function (err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close(); //close method has also been moved to client obj
    });
  });

  async function connectToMongo() {
    return new Promise (function (resolve, reject) {MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }, function (err, db) {
          resolve( db);
    });
});
  }

  function findByChatid(chatid){
    connectToMongo().then(db =>{
    var dbase = db.db("newdb");
    dbase.collection("orders").find({chatid: chatid.toString()}).sort({ordernumber:-1}).limit(1).toArray(function (err, result) {
        if (err) throw err;
        dbase.close();
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

  module.exports = {  findOrders, findByChatid};