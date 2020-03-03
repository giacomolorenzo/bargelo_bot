

function insertUser(jsonobj,MongoClient,bot){
    MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, function (err, db) {
      if (err) throw err;
  
      var dbase = db.db("newdb"); //here
      console.log("Switched to " + dbase.databaseName + " database");
      // insert document to 'users' collection using insertOne
      dbase.collection("users").insertOne(jsonobj, function (err, res) {
        if (err) throw err;
        console.log("Utente inserito");
        // close the connection to db when you are done with it
        db.close();
      });
    });
  }  
  module.exports = { insertUser};