
/*
Insert User
@param jsonobject(json to insert inside the users collection)
@param MongoClient client to duplicate istance of mongodb
*/
function insertUser(jsonobj,MongoClient,bot){
    MongoClient.connectToMongo().then(db =>{
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
/*
FindUserByChatId
Function to find a user from telegram chatid
@param chatid(telegram)
@param MongoClient client to duplicate istance of mongodb
*/
  async function findUserByChatid(chatId,MongoClient){
    return promise = new Promise(function(resolve, reject){MongoClient.connectToMongo().then(db =>{
      var dbo = db.db("newdb");
      console.log(chatId);
      let query = {chatid: chatId+"" }
      dbo.collection("users").find(query).toArray(function (err, result) {
        if (err) throw err;
        db.close();
        const resultResponse = result;
        console.log("User debug: "+ JSON.stringify(resultResponse))
        if(resultResponse != undefined || resultResponse.length != 0 ){
          console.log("debug return user filled!")
          resolve( resultResponse);
        } else {
          reject ("");
        }
        });
        
      });
    });

  }
  module.exports = { insertUser,findUserByChatid };