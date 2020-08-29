/* modulo ordini per inserire ordini tramite bot telegram o API rest


*/
//Istanzio mongo client



/*
Inserimento ordini e salvataggio su mongo
@param JSONObject
*/
function insertOrder(jsonobj, MongoClient) {
  console.log("Debug insertOrder: " + JSON.stringify(jsonobj));
  MongoClient.connectToMongo().then(db => {

    var dbase = db.db("newdb"); //here
    console.log("Switched to " + dbase.databaseName + " database");
    // find order number for single user 

    var doc = jsonobj;

    // insert document to 'users' collection using insertOne
    dbase.collection("orders").insertOne(doc, function (err, res) {
      if (err) throw err;
      console.log("ordine inserito");
      // close the connection to db when you are done with it
      db.close();
    });
  });
}

function updateOrder(jsonobj, mongoid, MongoClient, resRest, bot) {
  var ObjectId = require('mongodb').ObjectId;

  console.log("Debug insertOrder: " + JSON.stringify(jsonobj));
  MongoClient.connectToMongo().then(db => {
    var dbase = db.db("newdb"); //here
    console.log("Switched to " + dbase.databaseName + " database");
    // find order number for single user 
    delete jsonobj["_id"]
    var doc = {
      $set: jsonobj
    };
    try {
      dbase.collection("orders").updateOne({
        _id: ObjectId(mongoid)
      }, doc, function (err, res) {
        if (err) throw err;
        console.log("ordine Aggiornato " + res);
        // close the connection to db when you are done with it
        db.close();
        resRest.send(JSON.stringify(res));

        bot.sendMessage(jsonobj.chatid, "Il tuo ordine è stato modificato dal gestore fai /orderlist per vederne lo stato");

      });
    } catch (e) {
      console.log("Error", e.stack);
      console.log("Error", e.name);
      console.log("Error", e.message);
    }
    // insert document to 'users' collection using insertOne

  });
}
/*Order List
@param bot (telegram bot object to send response messages)
@param chatId (telegram chatId)
*/
function listOrder(bot, chatId, MongoClient) {
  MongoClient.findOrders(bot, chatId);
}
/*Rest Order List called by /orders
@param bot (telegram bot object to send response messages)
@param chatId (telegram chatId)
*/
function restListOrder(res, MongoClient) {
  MongoClient.connectToMongo().then(db => {
    var dbo = db.db("newdb");
    dbo.collection("orders").find({}).toArray(function (err, result) {
      if (err) throw err;
      const resp = JSON.stringify(result);
      console.log(resp);
      db.close();
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.send(resp);
    });
  });
}
/* Order List by chatid called by /orders
@param bot (telegram bot object to send response messages)
@param chatId (telegram chatId)
*/
async function findOrdernumber(chatid, mongoClient) {
  return promise = new Promise(function (resolve, reject) {
    let order = mongoClient.findByChatid(chatid);
    console.log("dindOrdernumber - " + JSON.stringify(order));
    resolve(mongoClient.findByChatid(chatid));
  });
}

module.exports = {
  insertOrder,
  updateOrder,
  listOrder,
  restListOrder,
  findOrdernumber
};