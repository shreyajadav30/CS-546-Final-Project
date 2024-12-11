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

router.get('/', (req, res, next) => {
	res.render('questionType', {
		title: 'Select Question Type',
		questionTypes: questionTypes,
	});
});

router.post('/create', async (req, res, next) => {
	const { type } = req.body;
	if (!type) {
		return next(createHttpError.BadRequest('Question type is required'));
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

	const categories = await questionsDataFunctions.getAllCategories();
	res.render('createQuestion', {
		title: 'Create Question',
		question,
		categories,
	});
});

router.post('/:id/create-question', async (req, res, next) => {
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
		useCount: 0,
	};
	console.log('type: ', type);

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

export default router;
