var express = require('express'),
  router = express.Router(),
  Article = require('../models/article');

var jsforce = require('jsforce');
var request = require('request');
var xml2js = require('xml2js');


///////// Time Module ///////////////////////
var moment = require('moment');
var DateFormat = "DD-MM-YYYY HH:mm:ss";
var invDateFormat = "DD-MM-YYYY";
var LogTimeStame = moment().format(DateFormat); 
var invTimeStame = moment().format(invDateFormat); 


///////// DB Module ///////////////////////
var mongo = require('mongodb');
var connString = 'mongodb://nodapi:nodapi@ds145370.mlab.com:45370/nodapidev';
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var dbm;
var colReqDonation;
var colResLowProfile;
var colResToken;
var colSettings;
var colCustomCCSettings;
var colUsers;
var colLog;
var colSFDC;

// Initialize connection once

mongo.MongoClient.connect(connString, function(err, database) {
  if(err) throw err;
 
  dbm = database;
  colReqDonation = dbm.collection('ReqDonation');
  colResLowProfile = dbm.collection('ResLowProfile');
  colResToken = dbm.collection('ResToken');
  colSettings = dbm.collection('Settings');
  colUsers = dbm.collection('Users');
  colLog =  dbm.collection('log');
  colSFDC = dbm.collection('SFDC');
  colCustomCCSettings = dbm.collection('CustomCCSettings');
});



///////// Logging Module ///////////////////////
var log4js = require('log4js');
var mongoAppender = require('log4js-node-mongodb');

log4js.addAppender(
    mongoAppender.appender({connectionString: connString}),
    'logger'
);

var logger = log4js.getLogger('logger');




module.exports = function (app) {
  app.use('/log', router);
};


logger.info("Gtech NodAPI Logger Module Loaded");



/*
 * GET Log List 
 */
router.get('/GetLogList', function(req, res) {
    
          var cursor = colLog.find({},{ limit : 200 });
          var result = [];
          cursor.each(function(err, doc) {
              if(err)
                  throw err;
              if (doc === null) {
                  // doc is null when the last document has been processed
                  
                result.sort(function(a, b){
                var TimeA=new Date(a.timestamp), TimeB=new Date(b.timestamp)
                //return dateB-dateA //sort by date ascending
                return TimeB-TimeA //sort by date decending
                })

                res.send(result);

                  return;
              }
              // do something with each doc, like push Email into a results array
              result.push(doc);
          }); 
    
});


