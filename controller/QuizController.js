const Quiz = require('../models/QuizzesSchema')

const createQuiz = async (req, res) => {
      const { lesson_id, title, question, correct_answer } = req.body

      try {
            const newQuiz = new Quiz({
                  lesson_id,
                  title,
                  question,
                  correct_answer
            });
            const savedQuiz = await newQuiz.save()
            res.status(201).json(savedQuiz)
      } catch (error) {
            res.status(400).json({ error: error.message })
      }
}
const getQuiz = async (req, res) => {
      try {
            const quizzes = await Quiz.find({})
                .populate('lesson_id') // Populate the lesson_id field
                .populate({
                    path: 'lesson_id',
                    populate: {
                        path: 'course_id',
                        populate: {
                            path: 'mentor'
                        }
                    }
                });

            if (quizzes.length === 0) { // Check if any quizzes were found
                  return res.status(404).json({ error: 'No quizzes found' });
            }

            res.status(200).json(quizzes);
      } catch (error) {
            res.status(500).json({ error: error.message });
      }
};

const getQuizById = async (req, res) => {
      try {
            const quizId = req.params.id;

            const quiz = await Quiz.findById(quizId)
                .populate('lesson_id') // Populate the lesson_id field
                .populate({
                    path: 'lesson_id',
                    populate: {
                        path: 'course_id',
                        populate: {
                            path: 'mentor'
                        }
                    }
                });
                
            if (!quiz) {
                  return res.status(404).json({ error: 'Quiz not found' });
            }

            res.status(200).json(quiz);
      } catch (error) {
            res.status(500).json({ error: error.message });
      }
}

const getQuizByLessonId = async (req, res) => {
    try {
        const lessonid = req.params.lessonid; // Assuming the lesson ID is passed as a parameter in the URL

        // Find all quizzes that belong to the specified lesson
        const quizzes = await Quiz.find({ lesson_id: lessonid });

        // Check if any quizzes were found
        if (quizzes.length === 0) {
            return res.status(404).json({ error: 'No quizzes found for the specified lesson' });
        }

        // Return the quizzes
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateQuizById = async (req, res) => {
    try {
        const quizId = req.params.id;
        const updates = req.body;

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // Check if the logged-in user is the mentor of the quiz
        if (quiz.mentor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized: You are not the mentor of this quiz' });
        }

        // Update the quiz document
        Object.assign(quiz, updates);

        // Increment the version manually
        quiz.__v += 1;

        const updatedQuiz = await quiz.save(); // This will trigger the versioning middleware

        res.status(200).json(updatedQuiz);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};  

const deleteQuizById = async (req, res) => {
    try {
        const quizId = req.params.id;

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // Check if the logged-in user is the mentor of the quiz
        if (quiz.mentor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized: You are not the mentor of this quiz' });
        }

        const deletedQuiz = await Quiz.findByIdAndDelete(quizId);

        if (!deletedQuiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createQuiz, getQuiz, getQuizById, getQuizByLessonId, updateQuizById, deleteQuizById };