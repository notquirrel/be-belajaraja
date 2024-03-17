const express = require('express')
const router = express.Router()

const AnswerController = require('../controller/AnswerController')
const isAuthenticated = require('../middleware/Authenticated');

router.post('/create', isAuthenticated, AnswerController.createAnswer)
router.get('/get', AnswerController.getAnswer)
router.get('/get/:id', isAuthenticated, AnswerController.getAnswerById)
router.get('/getbyquiz/:quizid', isAuthenticated, AnswerController.getAnswerByQuizId)
router.put('/update/:id', isAuthenticated, AnswerController.updateAnswerById);
router.delete('/delete/:id', isAuthenticated, AnswerController.deleteAnswerById);

module.exports = router;