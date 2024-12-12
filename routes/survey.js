import { Router } from "express";
import * as surveyData from "../data/survey.js";
import * as userData from "../data/users.js";
import * as helper from "../utils/helpers/survey.js";

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
      let {surveyName, startDate, endDate, questionnaire, status, surveyedFor, surveyedBy} = surData;
      
      surveyName = helper.checkString(surveyName, "Survey Name");
      startDate = helper.sDateValidate(startDate);
      endDate = helper.eDateValidate(startDate,endDate);
      status = helper.statusValid(status);
      //surveyedFor = helper.checkId(surveyedFor,"Survey For");
      //surveyedBy = helper.checkId(surveyedBy,"Survey By");

      const surveyDetails = await surveyData.addSurvey(surveyName, startDate, endDate, questionnaire, status, surveyedFor, surveyedBy);
      
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
