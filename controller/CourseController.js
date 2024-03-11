const Course = require('../models/CoursesSchema')
const path = require('path');

const createCourse = async (req, res) => {
      const { title, description, price, mentor } = req.body

      try {
            if (!req.file) {
                  return res.status(400).json({ error: 'No file uploaded' });
            }

            const cover = req.file.path;
            const fileName = path.basename(cover);

            const newCourse = new Course({
                  title,
                  description,
                  price,
                  mentor,
                  cover: fileName
            });
            const savedCourse = await newCourse.save()
            res.status(201).json(savedCourse)
      } catch (error) {
            res.status(400).json({ error: error.message })
      }
}
const getCourse = async (req, res) => {
      try {
            const courses = await Course.find({}); // Find all courses (empty filter)

            if (courses.length === 0) { // Check if any courses were found
                  return res.status(404).json({ error: 'No courses found' });
            }

            res.status(200).json(courses);
      } catch (error) {
            res.status(500).json({ error: error.message });
      }
};

const getCourseById = async (req, res) => {
      try {
          const courseId = req.params.id;
  
          const course = await Course.findById(courseId).populate('mentor');;
          if (!course) {
              return res.status(404).json({ error: 'Course not found' });
          }
  
          // Construct the image URL based on the relative path stored in the cover field
          const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${course.cover}`;
  
          // Add the image URL to the course object
          const courseWithImageUrl = { ...course.toJSON(), imageUrl };
  
          res.status(200).json(courseWithImageUrl);
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  };
  

const updateCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;
        const updates = req.body;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Check if the logged-in user is the mentor of the course
        if (course.mentor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized: You are not the mentor of this course' });
        }

        // Update the course document
        Object.assign(course, updates);

        // Increment the version manually
        course.__v += 1;

        const updatedCourse = await course.save(); // This will trigger the versioning middleware

        res.status(200).json(updatedCourse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};  

const deleteCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Check if the logged-in user is the mentor of the course
        if (course.mentor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized: You are not the mentor of this course' });
        }

        const deletedCourse = await Course.findByIdAndDelete(courseId);

        if (!deletedCourse) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createCourse, getCourse, getCourseById, updateCourseById, deleteCourseById };