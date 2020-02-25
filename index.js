const TelegramBot = require('node-telegram-bot-api');
fs = require('fs');
var express = require('express');
var app = express();
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
}, function (err, db) { //here db is the client obj
  if (err) throw err;
  var dbase = db.db("newdb"); //here
  dbase.createCollection("orders", function (err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close(); //close method has also been moved to client obj
  });
});

//place the value below with the Telegram token you receive from @BotFather
const token = '906197363:AAFv_gl9CCZ0b-_oQEiZe_OPVHLPLuqp6sw';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {
  polling: true
});
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



bot.onText(/\/order (.+)/, (msg, match) => {
  var jsonobj = {
    chatid: "" + msg.chat.id,
    message: match[1]
  }
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
  const chatId = msg.chat.id;
  const resp = "L'ordine è stato ricevuto"; // the captured "whatever"
  bot.sendMessage(chatId, resp);
});


bot.onText(/\/orderlist/, (msg, match) => {
  console.log("sono dentro orderlist")
  const chatId = msg.chat.id;


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
      bot.sendMessage(chatId, resp);
      console.log(result);
      db.close();
    });
  });

  // send back the matched "whatever" to the chat

});


bot.onText(/\/upload/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
  var keyboard1 = {
    parse_mode: "Markdown",
    reply_markup: {
      resize_keyboard: true,
      'one_time_keyboard': true,
      "keyboard": [
        ["Upload"],
        ["Back"]
      ]
    }
  };


  bot.sendMessage(chatId, "Select an event", keyboard1);
});

app.get('/', function (req, res) {
  res.send('Hello World!');
})
app.post('/orders', function (req, res) {
  MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, function (err, db) {
    if (err) throw err;
    // db pointing to newdb

    var dbase = db.db("newdb"); //here
    console.log("Switched to " + dbase.databaseName + " database");
    // document to be inserted
    var doc = req;

    // insert document to 'users' collection using insertOne
    dbase.collection("orders").insertOne(doc, function (err, res) {
      if (err) throw err;
      console.log("ordine inserito");
      // close the connection to db when you are done with it
      db.close();
    });
  });
  res.send(200)
});
app.get('/orders', function (req, res) {
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
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});