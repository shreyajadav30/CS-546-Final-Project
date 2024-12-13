import { ObjectId } from "mongodb";
import { questions } from "../config/mongoCollections.js";
import { validationMethods } from "../utils/helpers/validations.js";

export const getAllQuestionsWithGivenIds = async (objectIds) => {
  //   objectIds = objectIds.map((id) => ObjectId.createFromHexString(id));
  const questionsCollection = await questions();
  const categories = await questionsCollection
    .find({ "questions.questionId": { $in: objectIds } })
    .toArray();

  //   console.log(categories);

  const allQuestions = categories.reduce((acc, category) => {
    const categoryQuestions = category.questions.map((question) => ({
      ...question,
      categoryName: category.categoryName,
    }));
    return acc.concat(categoryQuestions);
  }, []);
  return allQuestions;
};
