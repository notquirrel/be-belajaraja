const express = require('express')
const router = express.Router()

const QuizController = require('../controller/QuizController')
const isAuthenticated = require('../middleware/Authenticated');

router.post('/create', isAuthenticated, QuizController.createQuiz)
router.get('/get', QuizController.getQuiz)
router.get('/get/:id', isAuthenticated, QuizController.getQuizById)
router.get('/getbylesson/:lessonid', isAuthenticated, QuizController.getQuizByLessonId)
router.put('/update/:id', isAuthenticated, QuizController.updateQuizById);
router.delete('/delete/:id', isAuthenticated, QuizController.deleteQuizById);

module.exports = router;