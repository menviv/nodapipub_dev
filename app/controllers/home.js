var express = require('express'),
  router = express.Router(),
  Article = require('../models/article');

module.exports = function (app) {
  app.use('/public', router);
};


console.log("Gtech NodAPI public functions");


router.get('/ValidateEmail/:email', function(req, res) {

    var email = req.params.email; 

    res.send(email);

    verifyEmail(email);

            function verifyEmail(email) {
            var status = "false";     
            var emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
                if (email.search(emailRegEx) == -1) {
                   // alert("Please enter a valid email address.");
                } else {
                 //   alert("Woohoo!  The email address is in the correct format and they are the same.");
                    status = "true";
                }
                return status;
            }

});



router.get('/ValidatePhone/:phone', function(req, res) {
/*
    var phone = req.params.phone; 
    
    var result = verifyPhone(phone);
    
    console.log("ValidatePhone: ", result);
    
    res.send(result);

            function verifyPhone(number)  
            {  
                var phoneRegex = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/;​​
                
                if(!number.match(phoneRegex)){
                    
                   return "false";
                   
                } else {
                    
                   return "true"; 
                    
                } 
            }              
*/
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