const Answer = require('../models/AnswersSchema')

const createAnswer = async (req, res) => {
      const { quiz_id, content, type } = req.body

      try {
            const newAnswer = new Answer({
                  quiz_id,
                  content,
                  type
            });
            const savedAnswer = await newAnswer.save()
            res.status(201).json(savedAnswer)
      } catch (error) {
            res.status(400).json({ error: error.message })
      }
}
const getAnswer = async (req, res) => {
      try {
            const answers = await Answer.find({})
                .populate('quiz_id') // Populate the quiz_id field
                .populate({
                    path: 'quiz_id',
                    populate: {
                        path: 'lesson_id',
                        populate: {
                            path: 'course_id',
                            populate: {
                                path: 'mentor'
                            }
                        }
                    }
                });

            if (answers.length === 0) { // Check if any answers were found
                  return res.status(404).json({ error: 'No answers found' });
            }

            res.status(200).json(answers);
      } catch (error) {
            res.status(500).json({ error: error.message });
      }
};

const getAnswerById = async (req, res) => {
      try {
            const quizId = req.params.id;

            const quiz = await Answer.findById(quizId)
                .populate('quiz_id') // Populate the quiz_id field
                .populate({
                    path: 'quiz_id',
                    populate: {
                        path: 'lesson_id',
                        populate: {
                            path: 'course_id',
                            populate: {
                                path: 'mentor'
                            }
                        }
                    }
                });

            if (!quiz) {
                  return res.status(404).json({ error: 'Answer not found' });
            }

            res.status(200).json(quiz);
      } catch (error) {
            res.status(500).json({ error: error.message });
      }
}

const getAnswerByQuizId = async (req, res) => {
    try {
        const quizid = req.params.quizid; // Assuming the quiz ID is passed as a parameter in the URL

        // Find all answers that belong to the specified quiz
        const answers = await Answer.find({ quiz_id: quizid })
            .populate('quiz_id') // Populate the quiz_id field
            .populate({
                path: 'quiz_id',
                populate: {
                    path: 'lesson_id',
                    populate: {
                        path: 'course_id',
                        populate: {
                            path: 'mentor'
                        }
                    }
                }
            });

        // Check if any answers were found
        if (answers.length === 0) {
            return res.status(404).json({ error: 'No answers found for the specified quiz' });
        }

        // Return the answers
        res.status(200).json(answers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateAnswerById = async (req, res) => {
    try {
        const answerId = req.params.id;
        const updates = req.body;

        const answer = await Answer.findById(answerId)
            .populate('quiz_id') // Populate the quiz_id field
            .populate({
                path: 'quiz_id',
                populate: {
                    path: 'lesson_id',
                    populate: {
                        path: 'course_id',
                    }
                }
            });

        if (!answer) {
            return res.status(404).json({ error: 'Answer not found' });
        }

        // Extract the mentor ID from the associated course
        const mentorId = answer.course_id.mentor;

        // Check if the logged-in user is the mentor of the answer
        if (mentorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized: You are not the mentor of this answer' });
        }

        // Update the answer document
        Object.assign(answer, updates);

        // Increment the version manually
        answer.__v += 1;

        const updatedAnswer = await answer.save(); // This will trigger the versioning middleware

        res.status(200).json(updatedAnswer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};  

const deleteAnswerById = async (req, res) => {
    try {
        const answerId = req.params.id;

        const answer = await Answer.findById(answerId)
            .populate('quiz_id') // Populate the quiz_id field
            .populate({
                path: 'quiz_id',
                populate: {
                    path: 'lesson_id',
                    populate: {
                        path: 'course_id',
                    }
                }
            });

        if (!answer) {
            return res.status(404).json({ error: 'Answer not found' });
        }

        // Extract the mentor ID from the associated course
        const mentorId = answer.course_id.mentor;

        // Check if the logged-in user is the mentor of the answer
        if (mentorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized: You are not the mentor of this answer' });
        }

        const deletedAnswer = await Answer.findByIdAndDelete(answerId);

        if (!deletedAnswer) {
            return res.status(404).json({ error: 'Answer not found' });
        }

        res.status(200).json({ message: 'Answer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createAnswer, getAnswer, getAnswerById, getAnswerByQuizId, updateAnswerById, deleteAnswerById };