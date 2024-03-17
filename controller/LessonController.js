const Lesson = require('../models/LessonsSchema')

const createLesson = async (req, res) => {
      const { course_id, title, description, video_url, sequence } = req.body

      try {
            const newLesson = new Lesson({
                  course_id,
                  title,
                  description,
                  video_url,
                  sequence
            });
            const savedLesson = await newLesson.save()
            res.status(201).json(savedLesson)
      } catch (error) {
            res.status(400).json({ error: error.message })
      }
}
const getLesson = async (req, res) => {
      try {
            const lessons = await Lesson.find({})
                .populate('course_id') // Populate the course_id field
                .populate({
                    path: 'course_id',
                    populate: {
                        path: 'mentor', // Populate the mentor field inside the course_id
                    },
                });

            if (lessons.length === 0) { // Check if any lessons were found
                  return res.status(404).json({ error: 'No lessons found' });
            }

            res.status(200).json(lessons);
      } catch (error) {
            res.status(500).json({ error: error.message });
      }
};

const getLessonById = async (req, res) => {
      try {
            const lessonId = req.params.id;

            const lesson = await Lesson.findById(lessonId)
            .populate('course_id') // Populate the course_id field
            .populate({
                path: 'course_id',
                populate: {
                    path: 'mentor', // Populate the mentor field inside the course_id
                },
            });
            
            if (!lesson) {
                  return res.status(404).json({ error: 'Lesson not found' });
            }

            res.status(200).json(lesson);
      } catch (error) {
            res.status(500).json({ error: error.message });
      }
}

const getLessonByCourseId = async (req, res) => {
    try {
        const courseid = req.params.courseid; // Assuming the course ID is passed as a parameter in the URL

        // Find all lessons that belong to the specified course
        const lessons = await Lesson.find({ course_id: courseid })
            .populate('course_id') // Populate the course_id field
            .populate({
                path: 'course_id',
                populate: {
                    path: 'mentor', // Populate the mentor field inside the course_id
                },
            });

        // Check if any lessons were found
        if (lessons.length === 0) {
            return res.status(404).json({ error: 'No lessons found for the specified course' });
        }

        // Return the lessons
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateLessonById = async (req, res) => {
    try {
        const lessonId = req.params.id;
        const updates = req.body;

        const lesson = await Lesson.findById(lessonId);

        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        // Check if the logged-in user is the mentor of the lesson
        if (lesson.mentor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized: You are not the mentor of this lesson' });
        }

        // Update the lesson document
        Object.assign(lesson, updates);

        // Increment the version manually
        lesson.__v += 1;

        const updatedLesson = await lesson.save(); // This will trigger the versioning middleware

        res.status(200).json(updatedLesson);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};  

const deleteLessonById = async (req, res) => {
    try {
        const lessonId = req.params.id;

        const lesson = await Lesson.findById(lessonId);

        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        // Check if the logged-in user is the mentor of the lesson
        if (lesson.mentor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized: You are not the mentor of this lesson' });
        }

        const deletedLesson = await Lesson.findByIdAndDelete(lessonId);

        if (!deletedLesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        res.status(200).json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createLesson, getLesson, getLessonById, getLessonByCourseId, updateLessonById, deleteLessonById };