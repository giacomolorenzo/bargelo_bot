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
/*Lista degli ordini
@param bot (classe bot che permette i messaggi su telegram)
@param chatId (corrisponde al valore del Id chat di telegram)
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
      res.send(resp);
    });
  });
}

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

module.exports = {  insertOrder,  listOrder,  restListOrder,  findOrdernumber};