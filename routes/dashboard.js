import { Router } from "express";
import { dashboardDataFunctions, usersDataFunctions } from "../data/index.js";
import { getSurveyById } from "../data/survey.js";
import { getAllUserWithProvidedIds } from "../data/users.js";
import {
  getAllQuestionsWithGivenIds,
  getSurveyAnswer,
} from "../data/dashboard.js";
import {
  checkId,
  checkString,
  isValidArray,
  ratingValidation,
} from "../utils/helpers/helpers.js";
import { getQuestionById } from "../data/dashboard.js";
import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const router = Router();

const getSurveyDetails = async (surveysArr) => {
  let arrAns = [];
  if (surveysArr.length > 0) {
    arrAns = await Promise.all(
      surveysArr.map(async (surveyData) => {
        let obj = {};
        let curSurvey = await getSurveyById(surveyData.surveyId.toString());
        obj["surveyDetailsData"] = curSurvey;

        let pendingSurvey = await getAllUserWithProvidedIds(
          surveyData.surveyingFor
        );
        obj["completedSurvey"] = [];
        if (surveyData.responses && surveyData.responses.length) {
          let completedSurvey = await getAllUserWithProvidedIds(
            surveyData.responses
          );
          obj["completedSurvey"] = completedSurvey;
        }

        obj["surveyingForData"] = pendingSurvey;
        obj["isAnySurveyPending"] = pendingSurvey.length !== 0;
        obj["isAnySurveyCompleted"] = obj["completedSurvey"].length !== 0;
        // console.log(obj);
        return obj;
      })
    );
  }

  return arrAns;
};
const getSurveyQuestionsDetails = async (id) => {
  let survey = await getSurveyById(id);
  let arrAns = [];
  if (Object.keys(survey.selectedQuestions).length > 0) {
    arrAns = await Promise.all(
      Object.keys(survey.selectedQuestions).map(async (category) => {
        let obj = {};
        let allQueIds = survey.selectedQuestions[category];
        // console.log(category, allQueIds);
        obj["category"] = category;

        let queArr = await getAllQuestionsWithGivenIds(allQueIds);
        // console.log(queArr);
        obj["questions"] = queArr;
        return obj;
      })
    );
  }

  return arrAns;
};

router.route("/").get(async (req, res) => {
  const user = await usersDataFunctions.getUserById(req.session.user._id);
  if (!user) {
    return res.status(404).render("error", {
      title: "Not Found",
      message: "404: Not Found",
      link: "/",
      linkName: "Home",
    });
  }

  let surveyDetails = await getSurveyDetails(user.surveys);

  res.status(200).render("dashboard", { title: "Dashboard", surveyDetails });
});

router
  .route("/fillSurvey/:surveyId/:surveyingForId/")
  .get(async (req, res) => {
    try {
      req.params.surveyId = checkId(req.params.surveyId);
      req.params.surveyingForId = checkId(req.params.surveyingForId);

      const surveyQuestionsDetails = await getSurveyQuestionsDetails(
        req.params.surveyId
      );
      res.status(200).render("fillSurvey", {
        title: "Fill Survey",
        questions: surveyQuestionsDetails,
        surveyId: req.params.surveyId,
        surveyingForId: req.params.surveyingForId,
      });
    } catch (e) {
      return res.status(404).render("error", {
        title: "Not Found",
        message: "404: Survey with that Id Not Found",
        link: "/",
        linkName: "Home",
      });
    }
  })
  .post(async (req, res) => {
    const surveyAnswerData = req.body;

    let errors = [];

    if (!surveyAnswerData || Object.keys(surveyAnswerData).length === 0) {
      errors.push("There are no fields in the request body");
    }

    try {
      req.params.surveyId = checkId(req.params.surveyId);
      req.params.surveyingForId = checkId(req.params.surveyingForId);
    } catch (e) {
      errors.push(e);
    }

    await Promise.all(
      Object.keys(surveyAnswerData).map(async (queId) => {
        try {
          let questionData = await getQuestionById(queId);
          // console.log(questionData, errors);

          switch (questionData.type) {
            case "single_select":
              surveyAnswerData[queId] = checkString(
                surveyAnswerData[queId],
                questionData.questionText
              );
              break;
            case "multi_select":
              isValidArray(surveyAnswerData[queId]);
              break;
            case "rating":
              surveyAnswerData[queId] = ratingValidation(
                surveyAnswerData[queId]
              );
              break;
            case "text":
              // console.log(surveyAnswerData[queId]);

              surveyAnswerData[queId] = checkString(
                surveyAnswerData[queId],
                questionData.questionText
              );
              break;
            default:
              if (!surveyAnswerData[queId]) {
                throw `Not a valid answer for ${questionData.questionText}`;
              }
              break;
          }
        } catch (e) {
          errors.push(e);
        }
      })
    );

    // console.log(errors);

    if (errors.length > 0) {
      const surveyQuestionsDetails = await getSurveyQuestionsDetails(
        req.params.surveyId
      );
      return res.status(400).render("fillSurvey", {
        title: "Fill Survey",
        hasErrors: true,
        errors,
        surveyAnswerData,
        questions: surveyQuestionsDetails,
        surveyId: req.params.surveyId,
        surveyingForId: req.params.surveyingForId,
      });
    }

    try {
      const response = await dashboardDataFunctions.surveyResponse(
        req.params.surveyId,
        surveyAnswerData,
        req.session.user._id,
        req.params.surveyingForId
      );

      if (response.answerAdded) {
        const usersCollection = await users();

        const updatedUserInfo = await usersCollection.updateOne(
          { _id: ObjectId.createFromHexString(req.session.user._id) },
          {
            $pull: {
              "surveys.$[elem].surveyingFor": req.params.surveyingForId,
            },
            $push: {
              "surveys.$[elem].responses": req.params.surveyingForId,
            },
          },
          {
            arrayFilters: [
              {
                "elem.surveyId": ObjectId.createFromHexString(
                  req.params.surveyId
                ),
              },
            ],
          }
        );

        if (!updatedUserInfo) {
          throw "could not update user successfully because it doesnot exists anymore.";
        }

        // return updatedUserInfo;
        return res.redirect("/dashboard");
      } else {
        const surveyQuestionsDetails = await getSurveyQuestionsDetails(
          req.params.surveyId
        );
        return res.status(400).render("fillSurvey", {
          title: "Fill Survey",
          hasErrors: true,
          errors: response.errors,
          surveyAnswerData,
          questions: surveyQuestionsDetails,
          surveyId: req.params.surveyId,
          surveyingForId: req.params.surveyingForId,
        });
      }
    } catch (e) {
      console.log(e);

      return res.status(500).render("error", {
        title: "Error",
        message: "Internal Server Error",
        link: "/dashboard",
        linkName: "Dashboard",
      });
    }
  });

router
  .route("/filledSurveyPreview/:surveyId/:surveyingForId/")
  .get(async (req, res) => {
    try {
      req.params.surveyId = checkId(req.params.surveyId);
      req.params.surveyingForId = checkId(req.params.surveyingForId);

      const surveyAnswer = await getSurveyAnswer(
        req.params.surveyId,
        req.session.user._id,
        req.params.surveyingForId
      );
      if (!surveyAnswer) {
        // error
      }
      let questionAnswerObject = {};

      await Promise.all(
        Object.keys(surveyAnswer.answers).map(async (queId) => {
          let que = await getQuestionById(queId);

          if (Object.keys(questionAnswerObject).includes(que.categoryName)) {
            questionAnswerObject[que.categoryName].push({
              ...que,
              answer: surveyAnswer.answers[queId],
            });
          } else {
            questionAnswerObject[que.categoryName] = [
              {
                ...que,
                answer: surveyAnswer.answers[queId],
              },
            ];
          }
        })
      );

      // console.log(questionAnswerObject);

      res.status(200).render("filledSurveyPreview", {
        title: "Filled Survey Preview",
        questions: Object.entries(questionAnswerObject).map(([key, value]) => ({
          key,
          value,
        })),
        surveyId: req.params.surveyId,
        surveyingForId: req.params.surveyingForId,
      });
    } catch (e) {
      console.log(e);

      return res.status(404).render("error", {
        title: "Not Found",
        message: "404: Survey with that Id Not Found",
        link: "/",
        linkName: "Home",
      });
    }
  });

export default router;
