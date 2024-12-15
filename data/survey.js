import { survey, users } from "../config/mongoCollections.js";
import * as helper from "../utils/helpers/survey.js";
import * as userData from "../data/users.js";
import { ObjectId } from "mongodb";

export const addSurvey = async (
  surveyCreated,
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
    surveyCreated,
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
            responses: [],
          },
        },
      }
    );
    if (!updatedUserInfo) {
      throw "could not update survey successfully because it does not exists anymore.";
    }
  });

  return insertedSurvey;
};

export const getSurveyById = async (id) => {
  // validateInputsId(id);

  const surveyCollection = await survey();
  const curSurvey = await surveyCollection.findOne({
    _id: ObjectId.createFromHexString(id),
  });
  if (curSurvey === null) throw "No Survey with that id.";
  curSurvey._id = curSurvey._id.toString();
  return curSurvey;
};

export const getSurveyList = async (userId) => {
  const surveyCollection = await survey();
  const curList = await surveyCollection
    .find({ surveyCreated: userId })
    .toArray();
  return curList;
};

export const getAllSurveys = async (userId) => {
  const surveyCollection = await survey();
  const surveys = await surveyCollection.find({}).toArray();
  return surveys;
};

export const removeSurvey = async (id) => {
  const surveyCollection = await survey();
  const surveydeletionInfo = await surveyCollection.findOneAndDelete({
    _id: ObjectId.createFromHexString(id),
  });

  if (!surveydeletionInfo) {
    throw `Could not delete survey with id of ${id}, as it doesnot exists.`;
  }
  return { _id: ObjectId.createFromHexString(id) };
};

export const getAllSurveysWithProvidedIds = async (ids) => {
  if (!ids) {
    return [];
  }
  // validateInputsId(id);
  const objectIds = ids.map((id) => ObjectId.createFromHexString(id));

  const surveyCollection = await survey();
  let errors = [];
  // try {
  //   ids = checkId(ids, "id");
  // } catch (e) {
  //   errors.push(e);
  // }
  // if (errors.length > 0) {
  //   // console.log('errrrrrr', errors);
  //   return {
  //     hasError: true,
  //     errors,
  //   };
  // }
  let surveyById = await surveyCollection
    .find({ _id: { $in: objectIds } })
    .toArray();

  if (!surveyById) throw "No survey with that id.";
  // surveyById = surveyById.map((id) => id.toString());
  return surveyById;
};

export const updateSurvey = async (id) => {};
