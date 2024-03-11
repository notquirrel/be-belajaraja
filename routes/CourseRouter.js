const express = require('express')
const router = express.Router()
const { upload } = require('../server');

const CourseController = require('../controller/CourseController')
const isAuthenticated = require('../middleware/Authenticated');

router.post('/create', isAuthenticated, upload.single('cover'), CourseController.createCourse)
router.get('/get', CourseController.getCourse)
router.get('/get/:id', isAuthenticated, CourseController.getCourseById)
router.put('/update/:id', isAuthenticated, CourseController.updateCourseById);
router.delete('/delete/:id', isAuthenticated, CourseController.deleteCourseById);

module.exports = router;