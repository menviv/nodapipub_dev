
var express = require('express'),
  config = require('./config/config');



///////// Time Module ///////////////////////
var moment = require('moment');
var DateFormat = "DD-MM-YYYY HH:mm:ss";
var LogTimeStame = moment().format(DateFormat); 

///////// DB Module ///////////////////////
var mongo = require('mongodb');
var connString = 'mongodb://nodapi:nodapi@ds145370.mlab.com:45370/nodapidev';
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var dbm;
var colLog;

// Initialize connection once

mongo.MongoClient.connect(connString, function(err, database) {
  if(err) throw err;
 
  dbm = database;
  colLog =  dbm.collection('log');
});



///////// Logging Module ///////////////////////
var log4js = require('log4js');
var mongoAppender = require('log4js-node-mongodb');

log4js.addAppender(
    mongoAppender.appender({connectionString: connString}),
    'app'
);

var logger = log4js.getLogger('app');



var app = express();

module.exports = require('./config/express')(app, config);

app.listen(config.port, function () {
  //console.log('Express server listening on port ' + config.port);
  logger.info("Gtech NodAPI listening on port: " + config.port);
});
