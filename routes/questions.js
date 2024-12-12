import { Router } from 'express';
import createHttpError from 'http-errors';
import { ObjectId } from 'mongodb';
import { questionsDataFunctions } from '../data/index.js';

const router = Router();

const questionTypes = [
	{ name: 'Text', type: 'text' },
	{ name: 'Rating', type: 'rating' },
	{ name: 'Single Select', type: 'single_select' },
	{ name: 'Multi Select', type: 'multi_select' },
];

router.get('/', async (req, res, next) => {
	try {
		const questions = await questionsDataFunctions.getAllQuestions();
		res.render('questionList', {
			title: 'Question List',
			questions,
		});
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

router
	.route('/create-question')
	.get(async (req, res) => {
		try {
			res.render('selectQuestionType', {
				title: 'Select Question Type',
				questionTypes: questionTypes,
			});
		} catch (e) {
			return res.status(500).json({ error: e.message });
		}
	})
	.post(async (req, res, next) => {
		let { type } = req.body;
		if (!type) {
			return next(
				createHttpError.BadRequest('Question type is required')
			);
		}
		const isValidType = questionTypes.some(
			(questionType) => questionType.type === type
		);
		if (!isValidType) {
			return next(createHttpError.BadRequest('Invalid question type'));
		}
		const question = {
			id: new ObjectId(),
			type,
			questionText: '',
		};
		switch (type) {
			case 'single_select':
			case 'multi_select':
				question.options = ['', ''];
				break;
			case 'rating':
				question.scale = 5;
				break;
			default:
				break;
		}
		try {
			const categories = await questionsDataFunctions.getAllCategories();
			res.render('createQuestion', {
				title: 'Create Question',
				question,
				categories,
			});
		} catch (e) {
			return res.status(500).json({ error: e.message });
		}
	});

router
	.route('/create-question/:id')
	.get(async (req, res) => {})
	.post(async (req, res, next) => {
		// Todo: Error handling for question data
		const { id } = req.params;
		const { type, questionText, options, scale, category, newCategory } =
			req.body;

		let selectedCategory = category;
		if (category === 'other') {
			if (!newCategory) {
				return next(
					createHttpError.BadRequest('New category name is required')
				);
			}
			selectedCategory = newCategory;
		}

		const questionData = {
			questionId: id,
			questionText,
			type,
			useCount: 0,
		};

		switch (type) {
			case 'single_select':
			case 'multi_select':
				questionData.options = options;
				break;
			case 'rating':
				questionData.scale = scale;
				break;
			default:
				break;
		}

		try {
			await questionsDataFunctions.addQuestionToCategory(
				selectedCategory,
				questionData
			);
			res.redirect('/questions');
		} catch (err) {
			next(createHttpError.InternalServerError(err.message));
		}
	});

// !Dummy route to demo survey
router
	.route('/testSurvey')
	.get(async (req, res) => {
		try {
			// Get question according to survey id
			const questions = await questionsDataFunctions.getAllQuestions();
			res.render('testSurvey', {
				title: 'Survey',
				questions,
			});
		} catch (e) {
			return res.status(500).json({ error: e.message });
		}
	})
	.post(async (req, res, next) => {});

export default router;
