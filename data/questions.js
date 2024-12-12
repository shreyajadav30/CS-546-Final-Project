import { questions } from '../config/mongoCollections.js';

const getAllCategories = async () => {
	const questionsCollection = await questions();
	const categories = await questionsCollection
		.find({}, { projection: { categoryName: 1, _id: 0 } })
		.toArray();
	return categories.map((category) => category.categoryName);
};

const addQuestionToCategory = async (categoryName, questionData) => {
	const questionsCollection = await questions();
	let category = await questionsCollection.findOne({ categoryName });
	if (!category) {
		category = { categoryName, questions: [] };
		await questionsCollection.insertOne(category);
	}
	const updateInfo = await questionsCollection.updateOne(
		{ categoryName },
		{ $push: { questions: questionData } }
	);
	if (updateInfo.modifiedCount === 0) {
		throw new Error('Error adding question!');
	}
};

export { getAllCategories, addQuestionToCategory };
