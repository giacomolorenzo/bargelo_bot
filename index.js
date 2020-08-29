const TelegramBot = require('node-telegram-bot-api');
fs = require('fs');
var express = require('express');
var app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
// URL at which MongoDB service is running
global.url = "mongodb://localhost:27017/newdb";

  

// A Client to MongoDB
var MongoClient = require('./modules/mongo')
// order modules
var orders = require('./modules/orders.js');
// user modules
var users = require('./modules/users');


//place the value below with the Telegram token you receive from @BotFather
const token = '<insert-your-key>'; //don't worry the key is not valid

//bot declarations
const bot = new TelegramBot(token, {
  polling: true
});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, resp);
});
// insert order in mongodb
bot.onText(/\/order (.+)/, (msg, match) => {
  
    users.findUserByChatid(msg.chat.id,MongoClient).then(cbresult =>{
      console.log("Debug callback1")
      orders.findOrdernumber(msg.chat.id,MongoClient).then(cbfind=>{
        console.log("Callback2 "+cbfind);
      const result = cbresult[0];
      const findOrdernumber = cbfind;
      console.log("Debug callback2 "+findOrdernumber)
       let jsonobj = {
         chatid: "" + msg.chat.id,
         message: match[1],
         user: result.name,
         phone: result.phone_number,
         order_status: null,
         prezzo: 7.0,
         ordernumber: findOrdernumber,
         date: new Date()
       }
       console.log("Debug Ordine: "+JSON.stringify(jsonobj));
       try {
         orders.insertOrder(jsonobj);
       } catch (e) {
         console.log("Error", e.stack);
         console.log("Error", e.name);
         console.log("Error", e.message);
       }
     
       const chatId = msg.chat.id;
       const resp = "L'ordine è stato ricevuto";
       bot.sendMessage(chatId, resp);
      
   
    }).catch(error =>{
      console.log(error);
    })
  }).catch(error => {
    console.log(error);
  })
  
});
//Register user inside the collection user
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



app.post('/orders', function (req, res) {
  orders.insertOrder(req, MongoClient);
  res.send(200)
});

app.put('/orders', function (req, res) {
  const obj = req.body
  console.log(obj)
  const mongoid = obj._id;
  orders.updateOrder(obj,mongoid, MongoClient,res);
       
 
  console.log("Ordine aggiornato")
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
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.listen(5000, function () {
  console.log('Example app listening on port 3000!');
});



bot.on("polling_error", (err) => console.log(err));
