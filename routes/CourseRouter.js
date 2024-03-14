const express = require('express')
const router = express.Router()

const upload = require('../middleware/Upload')
const { uploadToCloudinary, removeFromCloudinary } = require('../services/cloudinary')

const CourseController = require('../controller/CourseController')
const isAuthenticated = require('../middleware/Authenticated');

router.post('/create', isAuthenticated, upload.single("cover"), CourseController.createCourse)
router.get('/get', CourseController.getCourse)
router.get('/mycourse', isAuthenticated, CourseController.getCourseByMentor)
router.get('/get/:id', isAuthenticated, CourseController.getCourseById)
router.put('/update/:id', isAuthenticated, upload.single("cover"), CourseController.updateCourseById);
router.delete('/delete/:id', isAuthenticated, CourseController.deleteCourseById);

module.exports = router;