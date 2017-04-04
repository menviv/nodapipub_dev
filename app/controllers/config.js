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
    'config'
);

var logger = log4js.getLogger('config');




module.exports = function (app) {
  app.use('/config', router);
};


logger.info("Gtech NodAPI configuratyion engine");


// Global Settings Variables

    var Terminal;
    var UserName;
    var LowProFileURL;
    var AsimonURL;
    var Operation;
    var DocTypeToCreate;
    var ShowCardOwnerPhone;
    var ShowCardOwnerEmail;
    var SFDCLoginUser;
    var SFDCLoginPass_Token;
    var SFDCEnvironmentURL;
    var Attempts;

     var Customfield1Label;
     var Customfield1Value;

     var Customfield2Label;
     var Customfield2Value;   

     var Customfield3Label;
     var Customfield3Value;

     var Customfield4Label;
     var Customfield4Value;

     var Customfield5Label;
     var Customfield5Value;  

     var HideCVV;
     var HideCreditCardUserId; 
    
    var InvoiceHead_CustName;
    var InvoiceHead_SendByEmail='true';
    var InvoiceHead_Language='he';  
    var InvoiceHead_Email; 
    var InvoiceHead_Date = invTimeStame; 
    var InvoiceHead_CustAddresLine1;
    var InvoiceLines_Price;
    var InvoiceLines_Description;
    
    

/*
 * POST: save custom CardCom Settings
 */
router.post('/SaveCardComSettings/', function(req, res) {

     var doc = req.body;
     var ObjID = doc._id; 

     HideCreditCardUserId = doc.hidedonarid;
     HideCVV = doc.hideCCcvc;

     Customfield1Label = doc.Customfield1Label;
     Customfield1Value = doc.Customfield1Value;

     Customfield2Label = doc.Customfield2Label;
     Customfield2Value = doc.Customfield2Value;     

     Customfield3Label = doc.Customfield3Label;
     Customfield3Value = doc.Customfield3Value;

     Customfield4Label = doc.Customfield4Label;
     Customfield4Value = doc.Customfield4Value;

     Customfield5Label = doc.Customfield5Label;
     Customfield5Value = doc.Customfield5Value;

 
    var o_id = new mongo.ObjectID(ObjID);
  
   colCustomCCSettings.update(
   { '_id': o_id },
   { $set: { "hidedonarid":HideCreditCardUserId, "hideCCcvc":HideCVV, "Customfield1Label":Customfield1Label, "Customfield1Value":Customfield1Value, "Customfield2Label":Customfield2Label, "Customfield2Value":Customfield2Value, "Customfield3Label":Customfield3Label, "Customfield3Value":Customfield3Value, "Customfield4Label":Customfield4Label, "Customfield4Value":Customfield4Value, "Customfield5Label":Customfield5Label, "Customfield5Value" : Customfield5Value } },
   function(err, results)
   
       {
           
       res.json(results);

       logger.info('Change Custom CardCom Settings Success');
       
       
       });

});





/*
 * GET current settings
 */
router.get('/getCardComSettings/', function(req, res) {
 
    var cursor = colCustomCCSettings.find({});
    var result = [];
    cursor.each(function(err, doc) {
        if(err) {

            throw err;
            logger.error('Get Custom CardCom Settings failure: ' + err);

        }

        if (doc === null) {
            // doc is null when the last document has been processed
            res.send(result);
            

                HideCreditCardUserId = result[0].hidedonarid;
                HideCVV = result[0].hideCCcvc;

                Customfield1Label = result[0].Customfield1Label;
                Customfield1Value = result[0].Customfield1Value;

                Customfield2Label = result[0].Customfield2Label;
                Customfield2Value = result[0].Customfield2Value;     

                Customfield3Label = result[0].Customfield3Label;
                Customfield3Value = result[0].Customfield3Value;

                Customfield4Label = result[0].Customfield4Label;
                Customfield4Value = result[0].Customfield4Value;

                Customfield5Label = result[0].Customfield5Label;
                Customfield5Value = result[0].Customfield5Value;


             logger.info('Load Custom CardCom Settings success');
    
            
            return;
        }
        // do something with each doc, like push Email into a results array
        result.push(doc);
    });    
    
    
});









/*
 * POST: Change Settings
 */
router.post('/changeSettings/', function(req, res) {

    var doc = req.body;
    var ObjID = doc._id; 
     Terminal = doc.Terminal;
     UserName = doc.UserName;
     LowProFileURL = doc.LowProFileURL;
    
     AsimonURL = doc.AsimonURL;
     Operation = doc.Operation;
     DocTypeToCreate = doc.DocTypeToCreate;
     ShowCardOwnerPhone = doc.ShowCardOwnerPhone;
     ShowCardOwnerEmail = doc.ShowCardOwnerEmail;
     SFDCLoginUser = doc.SFDCLoginUser;
     SFDCLoginPass_Token = doc.SFDCLoginPass_Token;
     SFDCEnvironmentURL = doc.SFDCEnvironmentURL;
     Attempts = doc.Attempts; 
 
    var o_id = new mongo.ObjectID(ObjID);
  
   colSettings.update(
   { '_id': o_id },
   { $set: { "LowProFileURL":LowProFileURL, "UserName":UserName, "Terminal":Terminal, "AsimonURL":AsimonURL, "Operation":Operation, "DocTypeToCreate":DocTypeToCreate, "ShowCardOwnerPhone":ShowCardOwnerPhone, "ShowCardOwnerEmail":ShowCardOwnerEmail, "SFDCLoginUser":SFDCLoginUser, "SFDCLoginPass_Token":SFDCLoginPass_Token, "SFDCEnvironmentURL":SFDCEnvironmentURL, "Attempts" : Attempts } },
   function(err, results)
   
       {
           
       res.json(results);

       logger.info('Change Settings Success');
       
       
       });

});




/*
 * GET current settings
 */
router.get('/getSettings/', function(req, res) {
 
    var cursor = colSettings.find({});
    var result = [];
    cursor.each(function(err, doc) {
        if(err) {

            throw err;
            logger.error('Get Settings failure: ' + err);

        }

        if (doc === null) {
            // doc is null when the last document has been processed
            res.send(result);
            
             Terminal = result[0].Terminal;
             UserName = result[0].UserName;
             LowProFileURL = result[0].LowProFileURL;
             AsimonURL = result[0].AsimonURL;
             Operation = result[0].Operation;
             DocTypeToCreate = result[0].DocTypeToCreate;
             ShowCardOwnerPhone = result[0].ShowCardOwnerPhone;
             ShowCardOwnerEmail = result[0].ShowCardOwnerEmail;
             SFDCLoginUser = result[0].SFDCLoginUser;
             SFDCLoginPass_Token = result[0].SFDCLoginPass_Token;
             SFDCEnvironmentURL = result[0].SFDCEnvironmentURL; 
             Attempts  = result[0].Attempts ; 

             logger.info('Load Settings success');
    
            
            return;
        }
        // do something with each doc, like push Email into a results array
        result.push(doc);
    });    
    
    
});


