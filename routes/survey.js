import { Router } from "express";
import * as surveyData from "../data/survey.js";
import * as userData from "../data/users.js";
import * as helper from "../utils/helpers/survey.js";
import nodemailer from "nodemailer";

const router = Router();
router.get("/", async (req, res) => {
  const userList = await userData.getAllUsers();
  res
    .status(200)
    .render("survey", { title: "Survey Form", userList: userList });
});

// Add this Google Account
// email: surveysync100@gmail.com
// password: ProjectSync@100
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "SurveySync100@gmail.com",
    pass: "ddcg crof hpjf ddev",
  },
});

router.post("/", async (req, res, next) => {
  const surData = req.body;
  console.log(surData);
  if (!surveyData || Object.keys(surveyData).length === 0) {
    return res
      .status(400)
      .json({ error: "400 : No data passed in request body" });
  }
  try {
    let {
      surveyName,
      startDate,
      endDate,
      questionnaire,
      status,
      surveyedFor,
      surveyedBy,
    } = surData;

    surveyName = helper.checkString(surveyName, "Survey Name");
    startDate = helper.sDateValidate(startDate);
    endDate = helper.eDateValidate(startDate, endDate);
    status = helper.statusValid(status);
    //surveyedFor = helper.checkId(surveyedFor,"Survey For");
    //surveyedBy = helper.checkId(surveyedBy,"Survey By");
    let userEmail = [];

    surveyedBy.forEach(async (val) => {
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
            Date: ${new Date().toLocaleDateString()}
            
            Best regards,
            The Survey Team
        `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${userEmail}`);

    const surveyDetails = await surveyData.addSurvey(
      surveyName,
      startDate,
      endDate,
      questionnaire,
      status,
      surveyedFor,
      surveyedBy
    );

    if (surveyDetails.acknowledged) {
      res.redirect("/dashboard");
    } else {
      return res.status(500).json({ error: "500 : Internal Server Error" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "500 : Internal Server Error" });
  }
});

export default router;
