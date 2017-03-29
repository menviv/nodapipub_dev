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
  colLog =  dbm.collection('Log');
  colSFDC = dbm.collection('SFDC');
});



///////// Logging Module ///////////////////////
var log4js = require('log4js');
var mongoAppender = require('log4js-node-mongodb');

log4js.addAppender(
    mongoAppender.appender({connectionString: connString}),
    'anno'
);

var logger = log4js.getLogger('anno');




module.exports = function (app) {
  app.use('/anno', router);
};




console.log("Gtech NodAPI Anonimouse functions");

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
    var Attempts ;
    
// Danar Details Variables

    var InvoiceHead_CustName;
    var InvoiceHead_SendByEmail='true';
    var InvoiceHead_Language='he';  
    var InvoiceHead_Email; 
    var InvoiceHead_Date = invTimeStame; 
    var InvoiceHead_CustAddresLine1;
    var InvoiceLines_Price;
    var InvoiceLines_Description;
    
    
    
// Global MongoDB function

function StoreData(col,data) {
    
    
    if (col=="ReqDonation") {

    	colReqDonation.insert(data, function(err, resultReqDonation){
    	
            return resultReqDonation;
    	
    	});        
        
    } else if (col=="ResLowProfile") {

    	colResLowProfile.insert(data, function(err, resultResLowProfile){
    	
            return resultResLowProfile;
    	
    	});         
        
    } else if (col=="ResToken") {
        
    	colResToken.insert(data, function(err, resultResToken){
    	
            return resultResToken;
    	
    	}); 
        
    } else if (col=="Settings") {
        
    	colSettings.insert(data, function(err, resultSettings){
    	
            return resultSettings;
    	
    	}); 
        
    } else if (col=="Users") {

    	colUsers.insert(data, function(err, resultUsers){
    	
            return resultUsers;
    	
    	});         
        
    } else if (col=="SFDC") {

    	colSFDC.insert(data, function(err, resultSFDC){
    	
            return resultSFDC;
    	
    	});         
        
    } else {

    	colLog.insert(data, function(err, resultLog){
    	
            return resultLog;
    	
    	});         
        
    }
    
};    




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
 * GET perform Login
 */
router.get('/Login/:userID/:Password', function(req, res) {
    
    var userID = req.params.userID; 
    
    var Password = req.params.Password;
    
 
    var cursor = colUsers.find({"userID":userID, "Password":Password});
    var result = [];
    cursor.each(function(err, doc) {
        if(err)
            throw err;
        if (doc === null) {
            // doc is null when the last document has been processed
            
            if (result.length) {
                
                result[0].login = "true";
                
                res.send(result);
                
                logger.info('Login Success: ' + userID);
                             
                
            } else {
                
                result.login = "false";
                
                res.send(result);

                logger.info('Login failure: ' + userID);             
                
            }            
            
            return;
        }
        // do something with each doc, like push Email into a results array
        result.push(doc);
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




/*
 * GET reoccuring list
 */
router.get('/getReoccuringList/:day', function(req, res) {
    
    var day = req.params.day; 
 

                        var conn = new jsforce.Connection({
                        // you can change loginUrl to connect to sandbox or prerelease env.
                           loginUrl : SFDCEnvironmentURL
                        });                    
                    
                        conn.login(SFDCLoginUser, SFDCLoginPass_Token, function(err, response) {
                  		if (err) { 
                                    return console.error(err); 
                                    logger.error('Login to SFDC [getReoccuringList] failure: ' + err);
                                 }

                            logger.info('Login to SFDC [getReoccuringList] success');
                
                
                  			conn.query("SELECT Id, Amount__c, BillDateGroup__c, attempts__c, donarid__c, Status__c  FROM Donation_Payment__c WHERE BillDateGroup__c='"+ day + "' AND (Status__c='Active' OR Status__c='wait')", function(err, result) {
                    		if (err) { return console.error(err); }

                            res.json(result);

                            logger.info('Get ReoccuringList from SFDC success');
                            
                
                  			});
                
                        });  
   
    
    
});








router.post('/QueryAnnoSFDC/', function(req, res) {

    var queryBody = req.body;

    var FirstName = queryBody.FirstName;
    var LastName = queryBody.LastName;
    
    InvoiceHead_CustName = FirstName + " " + LastName;
    
    var Phone = queryBody.Phone;
    var Email = queryBody.Email;
    
    InvoiceHead_Email = Email;
    
    var Address = queryBody.Address;
    
    InvoiceHead_CustAddresLine1 = Address;
    
    var DonationCause = queryBody.DonationCause;
    
    InvoiceLines_Description = DonationCause;
    
    var DateToCharge = queryBody.DateToCharge;
    var DonationType = queryBody.DonationType;
    var Amount = queryBody.SumToBill;
    
    InvoiceLines_Price = Amount;
    
    var Operation = queryBody.AddCustomerToDirectDebit;
    var Project = queryBody.Project;
    var DonationNumber = queryBody.DonationNumber;
    var DonationCode = queryBody.Donation_Type_id;
    
    if (DonationCode!='0') {
        
        InvoiceHead_SendByEmail='false';
    }
    
    var numPayments = queryBody.numPayments;
    var AnnoEmp = queryBody.AnnoEmp;
    var donarid = queryBody.donarid; 
    
    var BillDay = moment().date();
    
    var BillDateGroup;
    
    if (BillDay<5) {
        
        BillDateGroup="1";
        
    } else if (BillDay>4 && BillDay<8) {
        
        BillDateGroup="5";
        
    } else if (BillDay>7 && BillDay<11) {
        
        BillDateGroup="7";
        
    } else if (BillDay>10 && BillDay<13) {
        
        BillDateGroup="10";
        
    } else if (BillDay>12 && BillDay<16) {
        
        BillDateGroup="12";
        
    } else if (BillDay>15 && BillDay<20) {
       
       BillDateGroup="15"; 
        
    } else if (BillDay>19 && BillDay<25) {
        
        BillDateGroup="20";
        
    } else if (BillDay>24 && BillDay<26) {
        
        BillDateGroup="25";
        
    } else if (BillDay>26 && BillDay<31) {
        
        BillDateGroup="27";
        
    }

    var Status = "Active";
    var Statusicon = "https://livelovely.com/static/images/full-listing/icon-modal-success%402x.png";


    var status;
    var ContactID;
    var ResponseUrl;

    var conn = new jsforce.Connection({
    // you can change loginUrl to connect to sandbox or prerelease env.
       loginUrl : SFDCEnvironmentURL
    });
		conn.login(SFDCLoginUser, SFDCLoginPass_Token, function(err, response) {
  		if (err) { 

                    return console.error(err); 
                    logger.error('Login to SFDC [QueryAnnoSFDC] failure: ' + err);
                  
                 }

  			conn.query("SELECT Id, Email FROM Contact WHERE Email='"+ Email + "'", function(err, result) {
    		if (err) { 

                        return console.error(err); 
                        logger.error('Query SFDC [QueryAnnoSFDC] failure: ' + err);
                  
                     }

                
    			

                if (result.totalSize==0) {
                                        

                            // Single contact record creation
                            conn.sobject("Contact").create({ FirstName : FirstName, LastName : LastName, Email : Email, Field1__c : donarid, AddressCust__c: Address}, function(err, ret) {
                            if (err || !ret.success) { return console.error(err, ret); }
                            ContactID = ret.id;
                            console.log("ContactID record id : " + ContactID);

                            if (err) { 

                                return console.error(err); 
                                logger.error('Create New Contact in SFDC [QueryAnnoSFDC] failure: ' + err);
                  
                            } else {

                                logger.info('New ContactID: ' + ContactID + ' created in SFDC success');

                            }                           

                            
                            


                                    // Single donation record 
                                    conn.sobject("Donation_Payment__c").create({ Contact__c : ContactID, Project__c : Project, ReccuringDonationNo__c : "1", Amount__c : Amount, OriginalAmount__c :Amount , DonationType__c : DonationType, Operation__c : Operation, DateToBill__c : DateToCharge, OriginalDateToBill__c: DateToCharge, DonationNumber__c : DonationNumber, Original_Donation_Number__c : DonationNumber, DonationCode__c : DonationCode, Status__c : "wait", numPayments__c : numPayments, Statusicon__c : Statusicon, CreatedBy__c : AnnoEmp, donarid__c : donarid, BillDateGroup__c : BillDateGroup, attempts__c: "0"  }, function(err, ret) {
                                    if (err || !ret.success) { return console.error(err, ret); }
                                    
                                    res.json(ret.id);
                                    
                                    if (err) { 

                                        return console.error(err); 
                                        logger.error('Create New Donation_Payment__c in SFDC [QueryAnnoSFDC] failure: ' + err);
                        
                                    } else {

                                        logger.info('New Donation_Payment__c: ' + ret.id + ' created in SFDC success');

                                    }  
                                   
                                    });

                            });


                } else { 

                    var ContactID = result.records[0].Id;

                        // Single donation record 
                        conn.sobject("Donation_Payment__c").create({ Contact__c : ContactID, Project__c : Project, ReccuringDonationNo__c : "1", Amount__c : Amount, OriginalAmount__c :Amount, DonationType__c : DonationType, Operation__c : Operation, DateToBill__c : DateToCharge , OriginalDateToBill__c: DateToCharge, DonationNumber__c : DonationNumber, Original_Donation_Number__c : DonationNumber, DonationCode__c : DonationCode, Status__c : "wait", numPayments__c : numPayments, Statusicon__c : Statusicon, CreatedBy__c : AnnoEmp, donarid__c : donarid, BillDateGroup__c : BillDateGroup, attempts__c: "0"  }, function(err, ret) {
                        if (err || !ret.success) { return console.error(err, ret); }
                        res.json(ret.id);
                        

                             if (err) { 

                                        return console.error(err); 
                                        logger.error('Create New Donation_Payment__c on existing contact in SFDC [QueryAnnoSFDC] failure: ' + err);
                        
                                    } else {

                                        logger.info('New Donation_Payment__c: ' + ret.id + ' created on existing contact in SFDC success');

                             }  


                        
                        });                    

                }


  			});

        });

});




router.post('/successQueryAnnoSFDC/', function(req, res) {

    var queryBody = req.body;
    var responsecode = queryBody.responsecode;
    var Operation = queryBody.Operation;
    var internaldealnumber = queryBody.internaldealnumber;
    var LowProfileCode = queryBody.LowProfileCode;

    var DonationID;

    var conn = new jsforce.Connection({
    // you can change loginUrl to connect to sandbox or prerelease env.
       loginUrl : SFDCEnvironmentURL
    });



conn.login(SFDCLoginUser, SFDCLoginPass_Token, function(err, response) {
  		if (err) { return console.error(err); }


  			conn.query("SELECT Id FROM Donation_Payment__c WHERE LowProfileCode__c='"+ LowProfileCode + "'", function(err, result) {
  		        if (err) { 

                    return console.error(err); 
                    logger.error('Login to SFDC [successQueryAnnoSFDC] failure: ' + err);
                  
                 } else {

                     logger.info('Login to SFDC [successQueryAnnoSFDC] success');

                 }
            
                DonationID = result.records[0].Id;
                            
                var subDonationID = DonationID.substring(0, 15);  
                       

                if (result.totalSize > 0) {
                                        

                    // Single record update
                    conn.sobject("Donation_Payment__c").update({ 
                    Id : subDonationID,
                    Status__c: "alert",
                    TransactionID__c : internaldealnumber,
                    TransactionResultsID__c : responsecode,
                    TransactionResults__c : Operation
                    }, function(err, ret) {
                    if (err || !ret.success) { return console.error(err, ret); }
                    console.log('Updated Successfully : ' + ret.id);
                    
                    if (err) { 

                        return console.error(err); 
                        logger.error('Update Donation_Payment__c in SFDC [successQueryAnnoSFDC] failure: ' + err);
                    
                    } else {

                        logger.info('Update Donation_Payment__c ' + ret.id + ' in SFDC [successQueryAnnoSFDC] success');

                    }


                    }); 
                    
                                        

                } 
                
                if (responsecode=="0") {
                    
                    
                    var str = "username=" + UserName + "&lowprofilecode="+LowProfileCode+"&terminalnumber=" + Terminal;
                    
                    var encodeedStr = encodeURI(str);
                    
               
                    // Set the headers
                    var headers = {
                        'User-Agent':       'Super Agent/0.0.1',
                        'Content-Type':     'application/x-www-form-urlencoded'
                    };
                    
                    // Configure the request
                    var options = {
                        url: AsimonURL + encodeedStr ,
                        method: 'GET',
                        headers: headers
                       // form: reqBody 
                    };
            
                    // Start the request
                    request(options, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            // Print out the response body
                           // console.log(body);
                           
                        function findGetParameter(parameterName) {
                            var result = null,
                            tmp = [];                
                            var items = body.substr(1).split("&");
                            for (var index = 0; index < items.length; index++) {
                            tmp = items[index].split("=");
                            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
                            }
                            return result;
                        }
                            
                            var TokenResponse = findGetParameter("TokenResponse");                         
                            
                            var Token = findGetParameter("Token"); 
                            
                            var TokenExDate = findGetParameter("TokenExDate");
                            
                            var CardOwnerID = findGetParameter("CardOwnerID");
                            
                            var CardValidityYear = findGetParameter("CardValidityYear");
                            
                            var CardValidityMonth = findGetParameter("CardValidityMonth");
                            
                            var TokenApprovalNumber = findGetParameter("TokenApprovalNumber");
                            
                            var lowprofilecode = findGetParameter("LowProfileCode"); 
                            
                            var CardNumber = findGetParameter("ExtShvaParams.CardNumber5");
                            
                            var CreditType = findGetParameter("ExtShvaParams.CreditType63");
                            
                            var InternalDealNumber = findGetParameter("InternalDealNumber");
                                

                            
                            UpdateTokenInDonationRecordinSFDC();    
                            
                            
                            function UpdateTokenInDonationRecordinSFDC() {
                                
                                    
                                
                                    var conn = new jsforce.Connection({
                                    // you can change loginUrl to connect to sandbox or prerelease env.
                                       loginUrl : SFDCEnvironmentURL
                                    });                    
                                
                                    conn.login(SFDCLoginUser, SFDCLoginPass_Token, function(err, response) {
                              		if (err) { return console.error(err); }
                            
                            
                              			conn.query("SELECT Id FROM Donation_Payment__c WHERE LowProfileCode__c='"+ LowProfileCode + "'", function(err, result) {
                                		if (err) { return console.error(err); }
                                        
                                        DonationID = result.records[0].Id;
                                        
                                        var subDonationID = DonationID.substring(0, 15);

                                        
                                            if (err) { 

                                                return console.error(err); 
                                                logger.error('Update Asimon in Donation_Payment__c ' + subDonationID + ' in SFDC [UpdateTokenInDonationRecordinSFDC] failure: ' + err);
                                            
                                            } else {

                                                logger.info('Update Asimon in Donation_Payment__c ' + subDonationID + ' in SFDC [UpdateTokenInDonationRecordinSFDC] success');

                                            }    


                            
                                            if (result.totalSize > 0) {
                                          
                            
                                                // Single record update
                                                conn.sobject("Donation_Payment__c").update({ 
                                                Id : subDonationID,
                                                Status__c: "Active",
                                                attempts__c: "1",
                                                TokenResponse__c : TokenResponse,
                                                Token__c : Token,
                                                TokenExDate__c : TokenExDate,
                                                CardOwnerID__c : CardOwnerID,
                                                CardValidityYear__c : CardValidityYear,
                                                CardValidityMonth__c : CardValidityMonth,
                                                TokenApprovalNumber__c : TokenApprovalNumber,
                                                CardNumber__c : CardNumber,
                                                CreditType__c : CreditType,
                                                InternalDealNumber__c : InternalDealNumber
                                                }, function(err, ret) {
                                                if (err || !ret.success) { return console.error(err, ret); }
                                                console.log('Donation Token Record Updated Successfully : ' + ret.id);
                                                // ...
                                                }); 
                                                
                                                                    
                            
                                            } 
                            
                            
                              			});
                            
                                    });                    
                                
                                
                                
                                
                                
                            };               
                            
            
                        } else {
                            
                            console.log(response.statusCode);
                            
                        }
                    });                    
                    
                    
                    
                    
                } 


  			});

        });

});




router.post('/PerformDonation/', function(req, res) {

    var reqBody = req.body;
    
    var DonationNumber = parseInt(reqBody.DonationNumber);
    
    var DonationID;
       
    var uniqueId = Math.floor(Math.random() * 1000000000);  

    reqBody.uniqueID=uniqueId;
    
    reqBody.DocTypeToCreate = DocTypeToCreate; 
    
    reqBody.ShowCardOwnerPhone= ShowCardOwnerPhone; 
    
    reqBody.ShowCardOwnerEmail = ShowCardOwnerEmail; 
    
    reqBody.CreateTokenDeleteDate="01/01/2025"; 
    
    reqBody.IndicatorUrl="http://nodapipub.azurewebsites.net/anno/saveTokenAnnoSFDC"; 
    
    reqBody.TerminalNumber = Terminal;
    
    reqBody.UserName = UserName;
    
    reqBody.Operation = Operation; 
    
    var InvString = "&InvoiceHead.CustName=" + InvoiceHead_CustName + "&InvoiceHead.SendByEmail=" + InvoiceHead_SendByEmail + "&InvoiceHead.Language=" + InvoiceHead_Language + "&InvoiceHead.Date=" + InvoiceHead_Date + "&InvoiceHead.Email=" + InvoiceHead_Email + "&InvoiceHead.CustAddresLine1=" + InvoiceHead_CustAddresLine1 + "&InvoiceLines.Description=" + InvoiceLines_Description  + "&InvoiceLines.Price=" + InvoiceLines_Price;
 
   var encodeedInvString = encodeURI(InvString);
    
        var str = "";
        for (var key in reqBody) {
            if (str != "") {
                str += "&";
            }
            str += key + "=" + reqBody[key];
        }
        
        var encodeedStr = encodeURI(str);
        
   
        // Set the headers
        var headers = {
            'User-Agent':       'Super Agent/0.0.1',
            'Content-Type':     'application/x-www-form-urlencoded'
        };
        
        // Configure the request
        var options = {
            url: LowProFileURL + encodeedStr + encodeedInvString ,
            method: 'GET',
            headers: headers
           // form: reqBody 
        };

        // Start the request
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
               // console.log(body);
               
            function findGetParameter(parameterName) {
                var result = null,
                tmp = [];                
                var items = body.substr(1).split("&");
                for (var index = 0; index < items.length; index++) {
                tmp = items[index].split("=");
                if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
                }
                return result;
            }
                       

                var ResponseUrl = findGetParameter("url"); 
                
                var lowprofilecode = findGetParameter("LowProfileCode"); 
            
                
                UpdateDonationRecordinSFDC(lowprofilecode);    
                
                
                function UpdateDonationRecordinSFDC(lowprofilecode) {
                    
                        
                    
                        var conn = new jsforce.Connection({
                        // you can change loginUrl to connect to sandbox or prerelease env.
                           loginUrl : SFDCEnvironmentURL
                        });                    
                    
                        conn.login(SFDCLoginUser, SFDCLoginPass_Token, function(err, response) {


                            if (err) { 

                                return console.error(err); 
                                logger.error('Login to SFDC [PerformDonation] failure: ' + err);
                            
                            } else {

                                logger.info('Login to SFDC [PerformDonation] success');

                            }    


                
                  			conn.query("SELECT Id FROM Donation_Payment__c WHERE DonationNumber__c="+ DonationNumber + "", function(err, result) {

                                DonationID = result.records[0].Id;
                            
                                var subDonationID = DonationID.substring(0, 15);

    		                    if (err) { 

                                    return console.error(err); 
                                    logger.error('Query SFDC [PerformDonation] failure: ' + err);
                  
                                }
                        
           
                                if (result.totalSize > 0) {
                               
                                  // Single record update
                                    conn.sobject("Donation_Payment__c").update({ 
                                    Id : subDonationID,
                                    Status__c: "wait",
                                    LowProfileCode__c : lowprofilecode
                                    }, function(err, ret) {
                                    if (err || !ret.success) { return console.error(err, ret); }
                                    console.log('Donation Record Updated Successfully : ' + ret.id);
                                    // ...
                                    }); 


                                        if (err) { 

                                            return console.error(err); 
                                            logger.error('Update lowprofilecode in Donation_Payment__c ' + subDonationID + ' in SFDC [UpdateDonationRecordinSFDC] failure: ' + err);
                                                    
                                        } else {

                                            logger.info('Update lowprofilecode in Donation_Payment__c ' + subDonationID + '/' + lowprofilecode + ' in SFDC [UpdateDonationRecordinSFDC] success');

                                        }                                     
                                    
                                                        
                
                                } 
                
                
                  			});
                
                        });                    
                    
                    
                    
                    
                    
                };               
                
                   	    
 
                res.redirect(ResponseUrl);


            } else {
                
                console.log(response.statusCode);
                
            }
});


});