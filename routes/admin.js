var express = require("express");
var router = express.Router();
var auth = require('./auth.js');
var Question = require('../models/question');
var multer  = require('multer');

var storage = multer.diskStorage({
        destination: './public/questionPhotos',
        filename: function (req, file, cb) {
            switch (file.mimetype) {
                case 'image/jpeg':
                    ext = '.jpeg';
                    break;
                case 'image/png':
                    ext = '.png';
                    break;
            }
            cb(null, + Date.now() + ext);
        }
    });

var upload = multer({storage: storage});

router.route('/questions')
.get(function(req, res, next){

    Question.find({}, function(err, questions){
        if(err){
            res.status(500).json({success: false, message: "Server Error"});
        }
        else{
            res.json({success: true, questions: questions})
        }
    })
});


router.post('/questions/addQuestion', upload.single("questionImage"), function(req, res, next){
    var body = req.body;
    var fileInfo = req.file;
    var imageInfo = "";
    var options = [];
    if(req.file){
       imageInfo = req.file.filename;
    }
    if(req.body.options && req.body.options != '')
        var options = body.options.split(',');
        
    console.log(body);const Time = 120*60*1000;

    console.log(fileInfo);
    var newQuestion = new Question({const Time = 120*60*1000;

        question: body.question,
        correctAnswer: body.correctAnswer,
        options: options,
        image: imageInfo,
        questionType: body.type
    })

    newQuestion.save(function(err, question){
      if(err){
            res.status(500).json({success: false, message: "Server Error"});
        }
        else{
            res.json({success: true, question: question})
        }  
    })
});

router.post('/questions/editQuestion', function(req, res){
    console.log(req.body);

    var updatedQuestion ={
        question: req.body.question,
        correctAnswer: req.body.correctAnswer,
        image: req.body.image,
        options: (req.body.options)?req.body.options.split(','):[]
    }

    Question.findByIdAndUpdate(req.body._id, updatedQuestion, function(err, question){
       if(err){
            res.status(500).json({success: false, message: "Server Error"});
        }
        else{
            res.json({success: true, question: question})
        }  
    });
});

router.post('/questions/deleteQuestion', function(req, res){
    Question.findByIdAndDelete(req.body._id, function(err, question){
       if(err){
            res.status(500).json({success: false, message: "Server Error"});
        }
        else{
            res.json({success: true, question: question})
        }  
    });
});

module.exports = router;