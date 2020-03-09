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
   const userOrder = users.findUserByChatid(msg.chat.id,MongoClient);

   if(userOrder != "" || userOrder != undefined){
    var jsonobj = {
      chatid: "" + msg.chat.id,
      message: match[1]
    }
    try {
      orders.insertOrder(jsonobj, MongoClient);
    } catch (e) {
      console.log("Error", e.stack);
      console.log("Error", e.name);
      console.log("Error", e.message);
    }
  
    const chatId = msg.chat.id;
    const resp = "L'ordine è stato ricevuto";
    bot.sendMessage(chatId, resp);
   }else{
     bot.sendMessage(msg.chat.id, "Devi prima registrarti per poter ordinare qualcosa!");
   }

  
});
bot.onText(/\/register (.+)/, (msg, match) => {
  var array = match[1].split("-");
  if(array.length < 2 ){
    bot.sendMessage(chatId, "Inserisci correttamente i dati rispettando la sistassi example:Giacomo-123456970");
  }else{
  var jsonobj = {
    chatid: "" + msg.chat.id,
    name: array[0],
    phone_number: array[1]
  }
  try {
    users.insertUser(jsonobj,MongoClient);
  } catch (e) {
    console.log("Error", e.stack);
    console.log("Error", e.name);
    console.log("Error", e.message);
  }
  const chatId = msg.chat.id;
  const resp = "L'utente è stato inserito"; // the captured "whatever"
  bot.sendMessage(chatId,resp)

}
});

bot.onText(/\/start/, (msg, match) => {
  siteUrl = match[1];
  bot.sendMessage(msg.chat.id,'Vuoi registrarti per ordinare il pranzo?', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Registrati',
          callback_data: 'register',
          command: 'register'
          
        }
      ]]
    }
  });
});

bot.on("callback_query", (callbackQuery) => {
  const data = callbackQuery.data;
  const message = callbackQuery.message;
      if(data === "register"){
        bot.sendMessage(message.chat.id,'Inserisci il tuo nome ed il numero di telefono separato da una virgola example: /register Giacomo,3897968526')
      }

});

bot.onText(/\/orderlist/, (msg, match) => {
  console.log("sono dentro orderlist")
  const chatId = msg.chat.id;
  try {
    orders.listOrder(bot, chatId, MongoClient);
  } catch (e) {
    console.log("Error", e.stack);
    console.log("Error", e.name);
    console.log("Error", e.message);
  }

});


bot.onText(/\/menu/, (msg, match) => {
  bot.sendPhoto(msg.chat.id, 'images/pasto.jpeg')
});

app.use('/', express.static(__dirname + '/statichtml'));
app.post('/orders', function (req, res) {
  orders.insertOrder(req, MongoClient);
  res.send(200)
});
app.get('/orders', function (req, res) {

  try {
    orders.restListOrder(res, MongoClient);
  } catch (e) {
    console.log("Error", e.stack);
    console.log("Error", e.name);
    console.log("Error", e.message);
  }

});

app.post('/sendmessage', function (req, res) {
bot.sendMessage(req.chatid, req.message)
res.send(200);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});



bot.on("polling_error", (err) => console.log(err));