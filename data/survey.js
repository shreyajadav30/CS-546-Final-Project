import { survey, users } from "../config/mongoCollections.js";
import * as helper from "../utils/helpers/survey.js";
import * as userData from "../data/users.js";
import { ObjectId } from "mongodb";

export const addSurvey = async (
  surveyName,
  startDate,
  endDate,
  surveyQuestionList,
  status,
  userMappingData,
  selectedQuestions
) => {
  if (
    !surveyName ||
    !startDate ||
    !endDate ||
    !status ||
    !userMappingData ||
    !selectedQuestions
  ) {
    throw "Please enter Survey Name, startDate, endDate and status!";
  }

  const usersCollection = await users();

  surveyName = helper.checkString(surveyName, "Survey Name");
  startDate = helper.sDateValidate(startDate);
  endDate = helper.eDateValidate(startDate, endDate);
  status = helper.statusValid(status);
  //surveyedFor = helper.checkId(surveyedFor,"Survey For");
  //surveyedBy = helper.checkString(surveyedBy,"Survey By");

  let userMapping = [];
  let userServayingFor = {};

  Object.keys(userMappingData).map((surveyedFor) => {
    let surveyUsers = {};
    surveyUsers["surveyedFor"] = surveyedFor;
    surveyUsers["surveyedBy"] = userMappingData[surveyedFor];

    if (userMappingData[surveyedFor].length > 0) {
      userMappingData[surveyedFor].map((respondant) => {
        if (Object.keys(userServayingFor).includes(respondant)) {
          userServayingFor[respondant].push(surveyedFor);
        } else {
          userServayingFor[respondant] = [surveyedFor];
        }
      });
    }

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
    selectedQuestions,
  };

  const insertedSurvey = await surveyCollection.insertOne(surveyData);

  if (!insertedSurvey || !insertedSurvey.insertedId) {
    throw "Survey data is not inserted.";
  }
  const newSurveyId = insertedSurvey.insertedId.toString();

  Object.keys(userServayingFor).map(async (userMap) => {
    const updatedUserInfo = await usersCollection.updateOne(
      { _id: ObjectId.createFromHexString(userMap) },
      {
        $push: {
          surveys: {
            surveyId: insertedSurvey.insertedId,
            surveyingFor: userServayingFor[userMap],
          },
        },
      }
    );
    if (!updatedUserInfo) {
      throw "could not update team successfully because it doesnot exists anymore.";
    }
  });

  return insertedSurvey;
};
