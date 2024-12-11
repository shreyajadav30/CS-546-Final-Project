import { Router } from "express";
import * as surveyData from "../data/survey.js";
import * as userData from "../data/users.js";
import * as helper from "../utils/helpers/survey.js";

const router = Router();
router.get("/", async (req, res) => {
  const userList = await userData.getAllUsers();
  console.log(userList);

  res
    .status(200)
    .render("survey", { title: "Survey Form", userList: userList });
});

router.post("/", async (req, res, next) => {
  const surData = req.body;
  if (!surveyData || Object.keys(surveyData).length === 0) {
    return next(
      createHttpError.BadRequest("There are no fields in the request body")
    );
  }
  try {
    let { surveyName, startDate, endDate, questionnaire, status, userMapping } =
      surData;

    surveyName = helper.checkString(surveyName, "Survey Name");
    startDate = helper.sDateValidate(startDate);
    endDate = helper.eDateValidate(startDate, endDate);
    status = helper.statusValid(status);

    const surveyDetails = await surveyData.addSurvey(
      surveyName,
      startDate,
      endDate,
      questionnaire,
      status,
      userMapping
    );

    if (surveyDetails.acknowledged) {
      res.redirect("/dashboard");
    } else {
      return res.status(500).json({ error: "500 : Internal Server Error" });
    }
  } catch (e) {
    console.log(e);
    return next(createHttpError.InternalServerError(e));
  }
});

export default router;
