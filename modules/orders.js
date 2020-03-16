/* modulo ordini per inserire ordini tramite bot telegram o API rest


*/
//Istanzio mongo client



/*
Inserimento ordini e salvataggio su mongo
@param JSONObject
*/
function insertOrder(jsonobj, MongoClient) {
  console.log("Debug insertOrder: " + JSON.stringify(jsonobj));
  MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, function (err, db) {
    if (err) throw err;
    // db pointing to newdb

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

function updateOrder(jsonobj,mongoid, MongoClient,resRest) {
  console.log("Debug insertOrder: " + JSON.stringify(jsonobj));
  MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, function (err, db) {
    if (err) throw err;
    // db pointing to newdb

    var dbase = db.db("newdb"); //here
    console.log("Switched to " + dbase.databaseName + " database");
    // find order number for single user 

    var doc = jsonobj;

    // insert document to 'users' collection using insertOne
    dbase.collection("orders").update({_id: mongoid},doc, function (err, res) {
      if (err) throw err;
      console.log("ordine Aggiornato "+ res);
      // close the connection to db when you are done with it
      db.close();
      resRest.send(JSON.stringify(jsonobj));
    });
  });
}
/*Order List
@param bot (telegram bot object to send response messages)
@param chatId (telegram chatId)
*/
function listOrder(bot, chatId, MongoClient) {
  MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("newdb");
    console.log(chatId);
    let query = {
      chatid: chatId + ""
    }
    dbo.collection("orders").find(query).toArray(function (err, result) {
      if (err) throw err;
      db.close();
      result.forEach(function (element, index) {
        bot.sendMessage(chatId, "ordine n° " + index + " : " + element.message);
      });

    });
  });
}
/*Rest Order List called by /orders
@param bot (telegram bot object to send response messages)
@param chatId (telegram chatId)
*/
function restListOrder(res, MongoClient) {
  MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, function (err, db) {
    if (err) throw err;
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
async function findOrdernumber(chatid, MongoClient) {
  return promise = new Promise(function (resolve, reject) {
    MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, function (err, db) {
      if (err) throw err;
      var dbo = db.db("newdb");
      dbo.collection("orders").find({chatid: chatid.toString()}).sort({ordernumber:-1}).limit(1).toArray(function (err, result) {
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

module.exports = {  insertOrder, updateOrder, listOrder,  restListOrder,  findOrdernumber};