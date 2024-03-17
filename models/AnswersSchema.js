const mongoose = require('mongoose')
const Quizzes = require('./QuizzesSchema')
const { Schema } = mongoose

const AnswersSchema = new Schema({
    quiz_id: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz'
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['A', 'B', 'C'],
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})

AnswersSchema.pre('save', function(next) {
      this.updated_at = new Date();
      next();
});

const Answer = mongoose.model('Answer', AnswersSchema);

module.exports = Answer;