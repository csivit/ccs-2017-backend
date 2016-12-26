var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSetSchema = new Schema({
        type: String,
        _questions: [{type: Schema.Types.ObjectId, ref: 'Question'}],
        answers: [String],
        attemptedOn: Date,
        completedOn: Date,
        _user: {type: Schema.Types.ObjectId, ref: 'User'}   
});

module.exports = mongoose.model('QuestionSet', questionSetSchema);