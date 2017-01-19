var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    question: {type: String, required: true},
    correctAnswer: {type: String, required: true},
    image: {type: String, default: ""},
    options: {type: [String], default: []},
    questionType: {type: String,required: true, enum: ["tech", "management", "creative"]}   
})

module.exports = mongoose.model("Question", QuestionSchema);