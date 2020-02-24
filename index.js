const TelegramBot = require('node-telegram-bot-api');
fs = require('fs');

// URL at which MongoDB service is running
var url = "mongodb://localhost:27017/newdb";
 
// A Client to MongoDB
var MongoClient = require('mongodb').MongoClient;
 
// make client connect to mongo service
var MongoClient = require('mongodb').MongoClient;
 
// make client connect to mongo service
MongoClient.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function(err, db) {   //here db is the client obj
  if (err) throw err;
  var dbase = db.db("newdb"); //here
  dbase.createCollection("orders", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();   //close method has also been moved to client obj
  });
});

//place the value below with the Telegram token you receive from @BotFather
const token = '906197363:AAFv_gl9CCZ0b-_oQEiZe_OPVHLPLuqp6sw';
 
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
keyboard = [
    ['Carica il tuo menu']
];
// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
 
  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});


bot.onText(/\/upload/, (msg, match) => {
     
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
    var keyboard1 = {
        parse_mode: "Markdown",
        reply_markup: {
            resize_keyboard: true,
            'one_time_keyboard': true,
            "keyboard": [["Upload"],["Back"]]
        }
    };

    
    bot.sendMessage(chatId, "Select an event", keyboard1);
  });

  bot.onText(/\/order (.+)/, (msg, match) => {
     var jsonobj = {
       chatid: ""+msg.chat.id,
       message : match[1]
     }
     MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },function(err, db) {
      if (err) throw err;
      // db pointing to newdb
      
      var dbase = db.db("newdb"); //here
      console.log("Switched to "+dbase.databaseName+" database");
      // document to be inserted
      var doc = jsonobj;
      
      // insert document to 'users' collection using insertOne
      dbase.collection("orders").insertOne(doc, function(err, res) {
          if (err) throw err;
          console.log("ordine inserito");
          // close the connection to db when you are done with it
          db.close();
      });
  });
   
    const chatId = msg.chat.id;
    const resp = "L'ordine è stato ricevuto"; // the captured "whatever"
   
    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
  });
 
// Listen for any kind of message. There are different kinds of
// messages.
