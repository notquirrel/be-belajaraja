const mongoose = require('mongoose')
const Lessons = require('./LessonsSchema')
const { Schema } = mongoose

const QuizzesSchema = new Schema({
    lesson_id: {
        type: Schema.Types.ObjectId,
        ref: 'Lessons'
    },
    title: {
        type: String,
        required: true,
    },
    question: {
        type: String,
        required: true
    },
    correct_answer: {
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

QuizzesSchema.pre('save', function(next) {
      this.updated_at = new Date();
      next();
});

const Quiz = mongoose.model('Quiz', QuizzesSchema);

module.exports = Quiz;