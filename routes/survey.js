import { Router } from "express";
import { verifyAccessTokenMiddleware } from "../utils/helpers/jwtHelper.js";
import * as surveyData from "../data/survey.js"
import * as userData from "../data/users.js";
const router = Router();
router.get("/", async (req, res) => {
  const userList = await userData.getAllUsers();
  res.status(200).render("survey", { title: "Survey Form", userList : userList});
});

router.post("/", async (req, res, next) => {  
    const surData = req.body;
    console.log(surData);
    if (!surveyData || Object.keys(surveyData).length === 0) {
      return next(
        createHttpError.BadRequest("There are no fields in the request body")
      );
    }
    try {
    let {surveyName, startDate, endDate, questionnaire, status, userMapping} = surData;
    const surveyDetails = await surveyData.addSurvey(surveyName, startDate, endDate, questionnaire, status, userMapping);
    
    if(surveyDetails.acknowledged){
      res.redirect("/dashboard");
    }else{
      return res.status(500).json({error: '500 : Internal Server Error'});
    }
    
    }catch (e) {
      console.log(e);
      return next(createHttpError.InternalServerError(e));
    }
  });
  
export default router;
