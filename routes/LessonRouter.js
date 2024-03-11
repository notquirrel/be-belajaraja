const express = require('express')
const router = express.Router()

const LessonController = require('../controller/LessonController')
const isAuthenticated = require('../middleware/Authenticated');

router.post('/create', isAuthenticated, LessonController.createLesson)
router.get('/get', LessonController.getLesson)
router.get('/get/:id', isAuthenticated, LessonController.getLessonById)
router.get('/getbycourse/:courseid', isAuthenticated, LessonController.getLessonByCourseId)
router.put('/update/:id', isAuthenticated, LessonController.updateLessonById);
router.delete('/delete/:id', isAuthenticated, LessonController.deleteLessonById);

module.exports = router;