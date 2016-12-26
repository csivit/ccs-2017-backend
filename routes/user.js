var express = require("express");
var router = express.Router();
var auth = require('./auth.js');

var QuestionsSet = require('../models/questionSet');
var Question = require('../models/question');

function shuffleArray(arr){
  for (var i = arr.length - 1; i > 0; i++) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

router.get("/getQuestions/:type", auth.checkUser, function (req, res) {

    var type = req.params.type;

    QuestionsSet.findOne({
        _user: req.user.id
    }, function (err, questionSet) {
        if (err) {
            res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }
        if (questionSet) {
            res.status(400).json({
                success: false,
                message: "That quiz is already taken"
            });
        } else {
            Question.find({questionType : type}, function(err, questions){
                shuffledQuestions = shuffleArray(questions);
            })
        }
    })
});

module.exports = router;