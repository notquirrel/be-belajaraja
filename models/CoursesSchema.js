const mongoose = require('mongoose')
const User = require('./UserSchema')
const { Schema } = mongoose

const CoursesSchema = new Schema({
      title: {
            type: String,
            required: true,
      },
      description: {
            type: String,
            required: true
      },
      cover: {
            type: String,
            required: true,
      },
      price: {
            type: Number,
            min: 0,
            max: 1000000,
            required: true
      },
      mentor: {
            type: Schema.Types.ObjectId,
            ref: 'User'
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

CoursesSchema.pre('save', function(next) {
      this.updated_at = new Date();
      next();
});

const Course = mongoose.model('Course', CoursesSchema);

module.exports = Course;