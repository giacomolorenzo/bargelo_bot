const TelegramBot = require('node-telegram-bot-api');
fs = require('fs');
var express = require('express');
var app = express();
// URL at which MongoDB service is running
global.url = "mongodb://localhost:27017/newdb";


// A Client to MongoDB
var MongoClient = require('mongodb').MongoClient;

var orders = require('./modules/orders.js');

var users = require('./modules/users');


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

//bot declarations
const bot = new TelegramBot(token, {
  polling: true
});
keyboard = [
  ['Carica il tuo menu']
];
// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1]; 
  bot.sendMessage(chatId, resp);
});






bot.onText(/\/order (.+)/, (msg, match) => {
  var jsonobj = {
    chatid: "" + msg.chat.id,
    message: match[1]
  }

   orders.insertOrder(jsonobj);
  
  const chatId = msg.chat.id;
  const resp = "L'ordine è stato ricevuto"; 
  bot.sendMessage(chatId, resp);
});
bot.onText(/\/register (.+)/, (msg, match) => {
  var array = match[1].split(",");

  var jsonobj = {
    chatid: "" + msg.chat.id,
    name: array[0],
    phone_number: array[1],
    email: array[2]
  }
  users.insertUser(jsonobj);
  const chatId = msg.chat.id;
  const resp = "L'ordine è stato ricevuto"; // the captured "whatever"
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/orderlist/, (msg, match) => {
  console.log("sono dentro orderlist")
  const chatId = msg.chat.id;
  var result = orders.listOrder(bot,chatId);
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
  orders.insertOrder(req);
  res.send(200)
});
app.get('/orders', function (req, res) {
  let response = '';
  try {
   response = orders.restListOrder(res);
}
catch (e) {
    console.log("Error", e.stack);
    console.log("Error", e.name);
    console.log("Error", e.message);
}

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});



bot.on("polling_error", (err) => console.log(err));