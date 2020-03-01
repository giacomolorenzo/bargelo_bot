
var MongoClient = require('mongodb').MongoClient;
function insertUser(jsonobj){
    MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, function (err, db) {
      if (err) throw err;
  
      var doc = jsonobj;
      
      console.log("Switched to " + dbase.databaseName + " database");
  
      var dbase = db.db("newdb"); //here
      // insert document to 'users' collection using insertOne
      dbase.collection("users").insertOne(doc, function (err, res) {
        if (err) throw err;
        console.log("Utente inserito");
        // close the connection to db when you are done with it
        db.close();
      });
    });
  }  
  module.exports = { insertUser};