var express = require("express");
var router = express.Router();
var auth = require('./auth.js');

var QuestionSet = require('../models/questionSet');
var Question = require('../models/question');

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

router.get("/getQuestions/:type", auth.checkUser, function (req, res) {

    var type = req.params.type;
    QuestionSet.findOne({type: type, _user: req.user.id})
    .populate('_questions', 'question image options')
    .exec()
    .then(function(questionSet){
        if(questionSet){
            res.json({
                success: true,
                questionSet: questionSet
            })
            throw new Error('Question Set found');
        }
        return Question.find({questionType: type}).exec()
    }).then(function(questions){
        shuffledArray = shuffle(questions);
        console.log(shuffledArray);
        var questionIds = [];

        var newSet = new QuestionSet({
            type: type,
            _questions: shuffledArray,
            _user: req.user.id,
            attemptedOn: Date.now()
        })
        
        return newSet.save()
    }).then(function(questionSet){
        return questionSet.populate('_questions', 'question image options')
    }).then(function(questionSet){
            res.json({
                success: true,
                questionSet: questionSet
            })
    })
    .catch(function(err){
        //TODO: Add some proper way to handle this
    })
});

module.exports = router;