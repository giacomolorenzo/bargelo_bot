

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

  function findUserByChatid(chatId,MongoClient){
    MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, function (err, db) {
      if (err) throw err;
      var dbo = db.db("newdb");
      console.log(chatId);
      let query = {chatid: chatId+"" }
      dbo.collection("users").find(query).toArray(function (err, result) {
        if (err) throw err;
        db.close();
        const resultResponse = result;
        if(result != undefined || result.length != 0 ){
          return resultResponse;
        } else {
          return "";
        }
        });
        
      });

  }
  module.exports = { insertUser,findUserByChatid};