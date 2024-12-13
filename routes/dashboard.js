import { Router } from "express";
import { usersDataFunctions } from "../data/index.js";
import { getSurveyById } from "../data/survey.js";
import { getAllUserWithProvidedIds } from "../data/users.js";
import { getAllQuestionsWithGivenIds } from "../data/dashboard.js";
import { checkId } from "../utils/helpers/helpers.js";

const router = Router();

const getSurveyDetails = async (surveysArr) => {
  let arrAns = [];
  if (surveysArr.length > 0) {
    arrAns = await Promise.all(
      surveysArr.map(async (surveyData) => {
        let obj = {};
        let curSurvey = await getSurveyById(surveyData.surveyId.toString());
        obj["surveyDetailsData"] = curSurvey;

        let answer = await getAllUserWithProvidedIds(surveyData.surveyingFor);

        obj["surveyingForData"] = answer;
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

router.route("/fillSurvey/:id").get(async (req, res) => {
  try {
    req.params.id = checkId(req.params.id);
    const surveyQuestionsDetails = await getSurveyQuestionsDetails(
      req.params.id
    );
    res.status(200).render("fillSurvey", {
      title: "Fill Survey",
      questions: surveyQuestionsDetails,
    });
  } catch (e) {
    return res.status(404).render("error", {
      errorClassName: "error",
      errorText: `No survey found with that id!`,
    });
  }
});

export default router;
