var express = require("express");
var router = express.Router();
var auth = require('./auth.js');

var QuestionSet = require('../models/questionSet');
var User = require('../models/user');
var Question = require('../models/question');
var types = ["tech", "management", "creative"];
var timeUp = 15 * 60 * 1000;

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

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


// router.put("/profile", function (req, res) {
//     email = req.body.email;
//     phone = req.body.phone;
//     User.findById(req.user._id, function (req, res) {

//     })
// });

router.post("/feedback", auth.checkUser, function (req, res) {
    var update = {
        question1: req.body.question1,
        question2: req.body.question2,
        question3: req.body.question3
    }
    User.findByIdAndUpdate(req.user.id, update, function(err, user){
        if (err) {
            res.status(500).json({
                success: false,
                message: err
            })
        }
        res.json({
            success: true,
            user: user
        });
    });
});

router.get("/profile", auth.checkUser, function (req, res) {
    User.findById(req.user.id, function (err, user) {
        if (err) {
            res.status(500).json({
                success: false,
                message: err
            })
        }
        res.json({
            success: true,
            user: user
        });
    })
});

router.get("/getQuestions/:type", auth.checkUser, function (req, res) {

    var type = req.params.type;

    if (types.indexOf(type) > -1) {
        QuestionSet.findOne({
                type: type,
                _user: req.user.id
            })
            .populate('_questions', 'question image options')
            .exec()
            .then(function (questionSet) {
                if (questionSet) {
                    res.json({
                        success: true,
                        questionSet: questionSet
                    })
                    throw new Error('Question Set found');
                }
                return Question.find({
                    questionType: type
                }).exec()
            }).then(function (questions) {
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
            }).then(function (questionSet) {
                return questionSet.populate('_questions', 'question image options')
            }).then(function (questionSet) {
                res.json({
                    success: true,
                    questionSet: questionSet,
                    timer: timeUp + questionSet.attemptedOn - Date.now() 
                })

            })
            .catch(function (err) {
                //TODO: Add some proper way to handle this
            })
    } else {
        res.status(400).json({
            success: false,
            message: "Not a Valid Type"
        })
    }
});

router.post('/submitAnswers/:type', auth.checkUser, function (req, res) {
    var type = req.params.type;
    console.log(req.body);

    if (types.indexOf(type) > -1) {
        console.log(req.user);
        QuestionSet.findOne({
                type: type,
                _user: req.user.id
            }).exec()
            .then(function (questionSet) {
                if (questionSet.answers !== undefined) {
                    throw new Error('QuestionSet already has answers');
                } else {
                    questionSet.answers = req.body;
                    questionSet.completedOn = Date.now()
                    return questionSet.save()
                }
            }).then(function (questionSet) {
                User.findById(req.user.id, function(err, user){
                    user.testTaken[type] = true;
                    return user.save();
                })
            })
            .then(function (user) {
                res.json({
                    success: true,
                    message: "Answers saved",
                    user: user
                })
            }).catch(function (err) {
                console.log(err);
                res.status(400).json({
                    success: false,
                    message: err
                })
            })
    } else {
        res.status(400).json({
            success: false,
            message: "Not a Valid Type"
        })
    }
})

module.exports = router;