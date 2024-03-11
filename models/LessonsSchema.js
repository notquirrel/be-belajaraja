const mongoose = require('mongoose')
const Courses = require('./CoursesSchema')
const { Schema } = mongoose

const LessonsSchema = new Schema({
    course_id: {
        type: Schema.Types.ObjectId,
        ref: 'Courses'
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    video_url: {
        type: String,
        required: true
    },
    sequence: {
        type: Number,
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

LessonsSchema.pre('save', function(next) {
      this.updated_at = new Date();
      next();
});

const Lesson = mongoose.model('Lesson', LessonsSchema);

module.exports = Lesson;