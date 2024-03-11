const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const multer = require('multer');
const path = require('path');

require('dotenv').config();
const mongoString = process.env.MONGO_URI

const app = express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ================= CONFIG PACKAGES ========================//

// Multer configuration
const storage = multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, 'uploads/'); // Specify the directory where uploaded files will be stored
      },
      filename: function (req, file, cb) {
          cb(null, file.originalname); // Use the original file name for the uploaded file
      }
  });
  
const upload = multer({ storage: storage });

// Export the upload object
module.exports = { upload };

// CONNECTIONS
// mongoose.connect('mongodb+srv://gdc:23jLzhk2oYr0c9PE@belajaraja.ibkfhzp.mongodb.net/?retryWrites=true&w=majority&appName=belajarAja')
//       .then(() => console.log('Connected to MongoDB'))
//       .catch(err => console.error('Could not connect to MongoDB:', err));
mongoose.connect(mongoString)
      .then(() => console.log('Connected to MongoDB'))
      .catch(err => console.error('Could not connect to MongoDB:', err));

// CONNECTIONS
// ================= CONFIG ROUTER ========================//
const UserRouter = require('./routes/UserRouter')
const CourseRouter = require('./routes/CourseRouter')
const LessonRouter = require('./routes/LessonRouter')
const QuizRouter = require('./routes/QuizRouter')

app.use('/api/user', UserRouter)
app.use('/api/course', CourseRouter)
app.use('/api/lesson', LessonRouter)
app.use('/api/quiz', QuizRouter)

app.listen(4000, () => {
      console.log("successfully connected")
})

