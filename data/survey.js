import { survey } from "../config/mongoCollections.js";
import * as helper from "../utils/helpers/survey.js";
import * as userData from "../data/users.js";
import { ObjectId } from "mongodb";

export const addSurvey = async (
  surveyName,
  startDate,
  endDate,
  surveyQuestionList,
  status,
  userMappingData
) => {
  if (!surveyName || !startDate || !endDate || !status || !userMappingData) {
    throw "Please enter Survey Name, startDate, endDate and status!";
  }
  surveyName = helper.checkString(surveyName, "Survey Name");
  startDate = helper.sDateValidate(startDate);
  endDate = helper.eDateValidate(startDate, endDate);
  status = helper.statusValid(status);
  //surveyedFor = helper.checkId(surveyedFor,"Survey For");
  //surveyedBy = helper.checkString(surveyedBy,"Survey By");

  let userMapping = [];

  Object.keys(userMappingData).map((surveyedFor) => {
    let surveyUsers = {};
    surveyUsers["surveyedFor"] = surveyedFor;
    surveyUsers["surveyedBy"] = userMappingData[surveyedFor];
    userMapping.push(surveyUsers);
  });

  // let surveyUsers = {};

  // surveyUsers["surveyedFor"] = surveyedFor;
  // surveyUsers["surveyedBy"] = surveyedBy;

  // userMapping.push(surveyUsers);
  console.log(userMapping);

  const surveyCollection = await survey();
  const surveyData = {
    surveyName,
    startDate,
    endDate,
    surveyQuestionList,
    status,
    userMapping,
  };

  const insertedSurvey = await surveyCollection.insertOne(surveyData);

  if (!insertedSurvey || !insertedSurvey.insertedId) {
    throw "Survey data is not inserted.";
  }
  const newSurveyId = insertedSurvey.insertedId.toString();

  return insertedSurvey;
};
