const Course = require('../models/CoursesSchema');
const { uploadToCloudinary, removeFromCloudinary } = require('../services/cloudinary');

const createCourse = async (req, res) => {
      const { title, description, price } = req.body

      // Get the ID of the current logged-in user
      const mentor = req.user._id;

      try {
            // Upload image to Cloudinary
            const data = await uploadToCloudinary(req.file.path, "course-images");

            const newCourse = new Course({
                  title,
                  description,
                  price,
                  mentor,
                  cover: data.url,
                  publicId: data.public_id
            });
            const savedCourse = await newCourse.save()
            res.status(201).json(savedCourse)
      } catch (error) {
            res.status(400).json({ error: error.message })
      }
}
const getCourse = async (req, res) => {
      try {
            const courses = await Course.find({}).populate('mentor');; // Find all courses (empty filter)

            if (courses.length === 0) { // Check if any courses were found
                  return res.status(404).json({ error: 'No courses found' });
            }

            res.status(200).json(courses);
      } catch (error) {
            res.status(500).json({ error: error.message });
      }
};

const getCourseByMentor = async (req, res) => {
    try {
        // Get the ID of the current logged-in user
        const mentorId = req.user._id;

        // Find all courses where the mentor field matches the mentorId
        const courses = await Course.find({ mentor: mentorId });

        if (courses.length === 0) {
            return res.status(404).json({ error: 'No courses found for this mentor' });
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
  
          res.status(200).json(course);
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

        // Check if a new image file was uploaded
        let data;
        if (req.file) {
            // Find the publicId
            const publicId = course.publicId;

            // Remove from Cloudinary
            await removeFromCloudinary(publicId);

            // Upload new image to Cloudinary
            data = await uploadToCloudinary(req.file.path, "course-images");
        }

        // Update the course document
        if (data) {
            // If a new image was uploaded, update cover and publicId
            course.set({
                ...updates,
                cover: data.url,
                publicId: data.public_id
            });
        } else {
            // If no new image, update other fields only
            course.set(updates);
        }

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

        // Find the publicId
        const publicId = course.publicId;

        // Remove from Cloudinary
        await removeFromCloudinary(publicId);

        // Remove from Database
        const deletedCourse = await Course.findByIdAndDelete(courseId);

        if (!deletedCourse) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createCourse, getCourse, getCourseByMentor, getCourseById, updateCourseById, deleteCourseById };