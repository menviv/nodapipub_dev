var express = require('express'),
  router = express.Router(),
  Article = require('../models/article');

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
var colReqDonation;
var colSettings;
var colCustomCCSettings;
var colUsers;
var colLog;

// Initialize connection once

mongo.MongoClient.connect(connString, function(err, database) {
  if(err) throw err;
 
  dbm = database;
  colReqDonation = dbm.collection('ReqDonation');
  colSettings = dbm.collection('Settings');
  colUsers = dbm.collection('Users');
  colLog =  dbm.collection('log');
  colCustomCCSettings = dbm.collection('CustomCCSettings');
});


///////// Logging Module //////////////////////////////////////
var log4js = require('log4js');
var mongoAppender = require('log4js-node-mongodb');

log4js.addAppender(
    mongoAppender.appender({connectionString: connString}),
    'publicFunctions'
);

var logger = log4js.getLogger('publicFunctions');


module.exports = function (app) {
  app.use('/public', router);
};

logger.info('Gtech NodAPI public Functions');





///////// Public Functions //////////////////////////////////////




/////////////////////////////////////////////////////////
/* Email Validation                                    */
/////////////////////////////////////////////////////////
router.get('/ValidateEmail/:email', function(req, res) {

    var email = req.params.email; 

    logger.info("Request to Function ValidateEmail by: " + email);

    var results = verifyEmail(email);

    res.send(results);

            function verifyEmail(email) {
            var status = "false";     
            var emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
                if (email.search(emailRegEx) == -1) {
                   // alert("Please enter a valid email address.");
                } else {
                 //   alert("Woohoo!  The email address is in the correct format and they are the same.");
                    status = "true";
                    logger.info("Response to Function ValidateEmail by: " + email + " is "+ status);
                }
                return status;
            }

});





router.get('/ValidateID/:idnum', function(req, res) {

    var idnum = req.params.idnum; 

    var result = isValidIsraeliID(idnum);
    
    console.log("ValidateID: ", result);
    
    res.send(result);

    function isValidIsraeliID(id) {
      return /\d{9}/.test(id) && Array.from(id, Number).reduce((counter, digit, i) => {
            const step = digit * ((i % 2) + 1);
            return counter + (step > 9 ? step - 9 : step);
        }) % 10 === 0;
    }              

});