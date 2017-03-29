var express = require('express'),
  router = express.Router(),
  Article = require('../models/article');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  var articles = [new Article(), new Article()];
    res.render('index', {
      title: 'ממשק ניהול - חברת Gtech',
      articles: articles
    });
});


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
