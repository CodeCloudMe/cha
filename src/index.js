var config = require('../config'),
_ = require('underscore')._,
moment = require('moment'),
fs = require('fs'),
express = require('express'),
twilioClient = require('twilio')(config.accountSid, config.authToken),
Cleverbot = require('cleverbot-node'),
ElizaBot = require('./ElizaBot');
 
var cleverbot = new Cleverbot();
var eliza = new ElizaBot();
var express = require('express');
var app = express();
var server;
var rateModel;
var numbers = [];


// default to a 'localhost' configuration:
var connection_string = '127.0.0.1:27017/YOUR_APP_NAME';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}



var to2;
var from2;
var body2;

fs.readFile(__dirname + '/../data/rate_model.json', 'utf-8', function(err, data){ 

    if (err) throw err;
    rateModel = JSON.parse(data);
    app.use(express.urlencoded());

    app.post('/cleverbot', function(req, res){

      var timeFormat = "YYYY/MM/DD HH:mm:ss";
      var timestamp = moment().format(timeFormat);
      if (!_.isUndefined(getQueryParam("To", req)) &&
          !_.isUndefined(getQueryParam("From", req)) &&
          !_.isUndefined(getQueryParam("Body", req))){

        console.log();
        console.log(timestamp);
        console.log("To: " + getQueryParam("To", req));
        console.log("From: " + getQueryParam("From", req));
        console.log("Text: \"" + getQueryParam("Body", req) + "\"");
        text(getQueryParam("Body", req), getQueryParam("From", req));
       
      }

      res.send("Post ping recieved at " + timestamp);
    });
/*
    app.get("/", function(req, res) {
      res.send("Twilio-cleverbot is running! Text " + config.twilioNumber + " to chat with <a href=\"http://cleverbot.com\">Cleverbot</a>.");
    });

*/



 app.get('/chatbot', function(req, res){

      var timeFormat = "YYYY/MM/DD HH:mm:ss";
      var timestamp = moment().format(timeFormat);
      console.log(req.query.msg);
      if (!_.isUndefined(req.query.msg) &&
          !_.isUndefined(req.query.room) &&
          !_.isUndefined(req.query.user)){

        console.log();
        console.log(timestamp);
        console.log("To: me");
        console.log("From: " + req.query.room);
        console.log("Text: \"" + req.query.msg+ "\"");
        textAPI(req.query.msg, req.query.room);
       
      }

      res.send("get ping recieved at " + timestamp + "no params");
    });

     app.use(express.static(__dirname + '/public'));
    app.get('/', function(req, res) {
        fs.readFile(__dirname + '/public/index.html', 'utf8', function(err, text){
            res.send(text);
        });
    });

    server = app.listen(config.port, config.ip, function() {
        console.log('Listening on port %d', server.address().port);
    });
});

tACount=0;



/*
var mongoose = require('mongoose');

var db = mongoose.connection;

db.on('error', function(){console.log("error connecting db")});
db.once('open', function() {


  var movieSchema = new mongoose.Schema({
  title: { type: String }
, rating: String
, releaseYear: Number
, hasCreditCookie: Boolean
});

  var Movie = mongoose.model('Movie', movieSchema);


// Compile a 'Movie' model using the movieSchema as the structure.
// Mongoose also creates a MongoDB collection called 'Movies' for these documents.
//var Movie = mongoose.model('Movie', movieSchema);
  // Create your schemas and models here.



  // Compile a 'Movie' model using the movieSchema as the structure.
// Mongoose also creates a MongoDB collection called 'Movies' for these documents.


var thor = new Movie({
  title: 'Thor'
, rating: 'PG-13'
, releaseYear: '2011'  // Notice the use of a String rather than a Number - Mongoose will automatically convert this for us.
, hasCreditCookie: true
});

thor.save(function(err, thor) {
  if (err) return console.error(err);
  console.dir(thor);
});
});

mongoose.connect('mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/');

*/





var dbv;

var MongoClient = require('mongodb').MongoClient;
// the client db connection scope is wrapped in a callback:
MongoClient.connect('mongodb://'+connection_string, function(err, db) {
  if(err) throw err;
  dbv = db;
  var collection = db.collection('books').find().limit(10).toArray(function(err, docs) {
    console.dir(docs);
    db.close();
  })
})









function textAPI(message, phoneNumber) {

  //phonenumber is room Id
	cleverbot.write(message, function(response){

    var timeout = 1000;
    var response;

    if (response.message.indexOf("<html>")==-1) {
      console.log("code r1.");
      response = response.message;

     


    
    } else {
      
      if(tACount<=16){
        tACount= tACount+1;
        textAPI2(message, phoneNumber);
        return;
      }
      else{
        tACount=0
      }
        
        if (_.indexOf(numbers, phoneNumber) == -1) {
          console.log("NEW NUMBER")

           response = eliza.getInitial();
          numbers.push(phoneNumber);
        } else {
         response = eliza.transform(message);
        

            MongoClient.connect('mongodb://'+connection_string, function(err, db) {
  if(err) { console.log('mongo err'); return;}
  dbv = db;
     dbv.collection('msg').insert({"userMessage":message, "aiMessage":response, "phoneNumber":phoneNumber, "whichBot":2, "time":new Date().toString() },function(err, records){
        //  console.log("Record added as "+records[0]._id);
    })
})

       
         
        }
    }

    if(response.indexOf("html><head><title>") !=-1){

      response="I'm having a system overload (feels like indigestion). I need a few moments. Text me in a few.";
    }
      if(response.indexOf("Clever") !=-1 || response.indexOf("iOS") !=-1 || response == "" || response.indexOf("3600") !=-1 ){

        console.log("blocking spam or garbage");
        response="well...";
        textAPI(message, phoneNumber);
        return;
      }

        MongoClient.connect('mongodb://'+connection_string, function(err, db) {
  if(err) { console.log('mongo err'); return;}
  dbv = db;
   dbv.collection('msg').insert({"userMessage":message, "aiMessage":response, "phoneNumber":phoneNumber, "whichBot":1, "time":new Date().toString() }, function(err, records){
        //  console.log("Record added as "+records[0]._id);
    })
})
    console.log("Will respond with: \"" + response + "\" in " + (timeout / 1000 / 60) + " minutes.");
    
		setTimeout( function(){

      var Firebase = require('firebase');
var myRootRef = new Firebase('https://talk2.firebaseio.com/rooms/'+ phoneNumber);
myRootRef.push({"created_by":"bot","created_at":JSON.stringify(new Date()).split('"')[1], "content":response});
console.log(JSON.stringify({"created_by":"bot","created_at":JSON.stringify(new Date()).split('"')[1], "content":response}));
     


    console.log("response="+ response+ " and roomId="+phoneNumber);

    }, timeout);

	});

}

function textAPI2(message, phoneNumber) {


  cleverbot.write2(message, function(response){

    var timeout = 1000;
    var response;

    if (typeof response.message != "undefined" ) {
      if(response.message.indexOf("Guest")!=-1){
        text(message, phoneNumber);
        return;

      }
      console.log("code r3.");
     

    

      response = response.message;
    } else {
      
      if(tACount<=16){
        tACount= tACount+1;
        textAPI(message, phoneNumber);
        return;
      }
      else{
        tACount=0
      }
        
        if (_.indexOf(numbers, phoneNumber) == -1) {
          console.log("NEW NUMBER")
          response = eliza.getInitial();
          numbers.push(phoneNumber);
        } else {
         response = eliza.transform(message);
        }
    }

    if(response.indexOf("html><head><title>") !=-1){

      response="I'm having a system overload (feels like indigestion). I need a few moments. Text me in a few.";
    }
      if(response.indexOf("Clever") !=-1 || response.indexOf("iOS") !=-1 || response == "" || response.indexOf("3600") !=-1 ){

        console.log("blocking spam or garbage");
        response="well...";
        textAPI(message, phoneNumber);
        return;
      }

        MongoClient.connect('mongodb://'+connection_string, function(err, db) {
  if(err) { console.log('mongo err'); return;}
  dbv = db;
     dbv.collection('msg').insert({"userMessage":message, "aiMessage":response, "phoneNumber":phoneNumber, "whichBot":3, "time":new Date().toString() }, function(err, records){
          //console.log("Record added as "+records[0]._id);
    })
})
    console.log("Will respond with: \"" + response + "\" in " + (timeout / 1000 / 60) + " minutes.");
    
    setTimeout( function(){

          var Firebase = require('firebase');
var myRootRef = new Firebase('https://talk2.firebaseio.com/rooms/'+ phoneNumber);
myRootRef.push({"created_by":"bot","created_at":JSON.stringify(new Date()).split('"')[1], "content":response});
console.log(JSON.stringify({"created_by":"bot", "created_at":JSON.stringify(new Date()).split('"')[1], "content":response}));
      console.log("firebase response="+ response+ " and roomId="+phoneNumber);


    }, timeout);

  });
/*
mesas = dbv.collection('msg').find().limit(10).toArray(function(err, docs) {
    console.dir(mesas);
});

*/
}

function getQueryParam(name, req) {
    return req.body[name];
}
