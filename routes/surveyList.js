import { Router } from "express";
import * as surveyData from "../data/survey.js";
import * as userData from "../data/users.js";
import * as helper from "../utils/helpers/survey.js";
import nodemailer from "nodemailer";
import { questionsDataFunctions } from "../data/index.js";

const router = Router();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "SurveySync100@gmail.com",
    pass: "ddcg crof hpjf ddev",
  },
});


router.route("/").get(async (req, res) => {
    try {
      const userId = req.session.user._id;
      const surveyCollection = await surveyData.getSurveyList(userId);
      res
      .status(200)
      .render("surveyList", { title: "Survey List", surveyCollection});
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
    });
    
    router.route("/delete/:id").post(async (req, res) => {
      try {
        
        await surveyData.removeSurvey(req.params.id);
        res.redirect("/surveyList");
      } catch (e) {
        return res.status(404).render("error");
      }
    });
    router.route("/edit/:id").get(async (req, res) => {
      
      try {
        const editSurvey = await surveyData.updateSurvey(req.params.id);
        
        res.status(200).render("survey", {title: "Survey Form", isEditMode: true, surveyCreated : editSurvey});
      } catch (e) {
        return res.status(404).render("error");
      }
    });
    
    router.route("/edit/:id").post(async (req, res) => {
      let { surveyName, startDate, endDate, userMappingData, status, selectedQuestions } = req.body;
      
      try {
              surveyName = helper.checkString(surveyName, "Survey Name");
              startDate = helper.sDateValidate(startDate);
              endDate = helper.eDateValidate(startDate, endDate);
              status = helper.statusValid(status);
              userMappingData = JSON.parse(userMappingData);
              selectedQuestions = JSON.parse(selectedQuestions);
            Object.keys(userMappingData).map(async (user) => {
              
              let currentuser = await userData.getUserById(user);
              let userEmail = [];
              userMappingData[user].forEach(async (val) => {
                const userList = await userData.getUserById(val);
                userEmail.push(userList.email);
              });
              const mailOptions = {
                from: "SurveySync100@gmail.com",
                to: userEmail,
                subject: "Thank you for completing the survey!",
                text: `
                    Hi,
        
                    Thank you for participating in our survey. 
                    Your feedback is valuable to us!
        
                    Survey Title: ${surveyName}
                    You are surveying for : ${currentuser.firstName} ${
                  currentuser.lastName
                }
                    Date: ${new Date().toLocaleDateString()}
                    
                    Best regards,
                    The Survey Team
                `,
              };
        
              await transporter.sendMail(mailOptions);
              console.log(`Email sent to ${userEmail}`);
            });
        const editSurvey = await surveyData.replaceSurvey(req.params.id, surveyName, startDate, endDate, userMappingData, status, selectedQuestions);
        
        if (editSurvey) {
          res.redirect("/dashboard");
        } else {
          return res.status(500).json({ error: "500 : Internal Server Error" });
        }
      } catch (e) {
        return res.status(404).render("error");
      }
    });
    export default router;