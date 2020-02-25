
var MongoClient = require('mongodb').MongoClient;
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
  
  function listOrder(){
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
        return resp;
      });
    });
  }
  
  function restListOrder(){
    MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, function (err, db) {
      if (err) throw err;
      var dbo = db.db("newdb");
      dbo.collection("orders").find({}).toArray(function (err, result) {
        if (err) throw err;
        let resp = JSON.stringify(result);
        console.log(resp);
        res.send(resp);
        console.log(result);
        db.close();
      });
    });
  }

  module.exports = { insertOrder,listOrder,restListOrder };