/* modulo ordini per inserire ordini tramite bot telegram o API rest


*/
//Istanzio mongo client
var MongoClient = require('mongodb').MongoClient;


/*
Inserimento ordini e salvataggio su mongo
@param JSONObject
*/
function insertOrder(jsonobj){
    MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, function (err, db) {
      if (err) throw err;
      // db pointing to newdb
  
      var dbase = db.db("newdb"); //here
      console.log("Switched to " + dbase.databaseName + " database");
      // document to be inserted
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
  
  function listOrder(bot,chatId){
    MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, function (err, db) {
      if (err) throw err;
      var dbo = db.db("newdb");
      dbo.collection("orders").find({}).toArray(function (err, result) {
        if (err) throw err;
        const resp = JSON.stringify(result)
        console.log(resp);
        db.close();
        bot.sendMessage(chatId,resp); 
      });
    });
  }
  
  function restListOrder(res){
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

  module.exports = { insertOrder,listOrder,restListOrder };