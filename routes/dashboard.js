import { Router } from "express";
import { usersDataFunctions } from "../data/index.js";
import { getSurveyById } from "../data/survey.js";
import { getAllUserWithProvidedIds } from "../data/users.js";
import { getAllQuestionsWithGivenIds } from "../data/dashboard.js";
import { checkId } from "../utils/helpers/helpers.js";

const router = Router();

const getSurveyDetails = async (surveysArr) => {
  let arrAns = [];
  if (surveysArr && surveysArr.length > 0) {
    arrAns = await Promise.all(
      surveysArr.map(async (surveyData) => {
        let obj = {};
        let curSurvey = await getSurveyById(surveyData.surveyId.toString());
        obj["surveyDetailsData"] = curSurvey;
        
        if(curSurvey === null){
          return null;
        }
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
  console.log(survey);
  
  if (!survey) {
    throw new Error("No Survey with that id.");
  }

  let arrAns = [];
  console.log(survey.selectedQuestions);
  
  if (survey.selectedQuestions && Object.keys(survey.selectedQuestions).length > 0) {
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
  try{
    if (!user) {
      return res.status(404).render("error", {
        title: "Not Found",
        message: "404: Not Found",
        link: "/",
        linkName: "Home",
      });
    }
    console.log(user.surveys);
    let surveyDetails = await getSurveyDetails(user.surveys);
    console.log(surveyDetails);

    if(surveyDetails === null){
      
    }
    
    res.status(200).render("dashboard", { title: "Dashboard", surveyDetails });
  }catch(e){
    console.log(e);
    return res.status(404).json({ error: "404:No survey with that id"});
  }
  
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
