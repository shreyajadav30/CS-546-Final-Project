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
  console.log(userMappingData);
  
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
  if (!curSurvey) {
    console.log(`No survey found with the ID: ${id}`);
    return null; 
  }
  curSurvey._id = curSurvey._id.toString();
  return curSurvey;
};

export const getSurveyList = async(userId) => {
  const surveyCollection = await survey();
  const curList = await surveyCollection.find({ 'surveyCreated': userId }).toArray();
  console.log(curList);
  
  return curList;
}

export const removeSurvey = async(id) => {
  const surveyCollection = await survey();
  const userCollection = await users();
  const surveydeletionInfo = await surveyCollection.findOneAndDelete({
    _id: ObjectId.createFromHexString(id),
  });

  if (!surveydeletionInfo) {
    throw `Could not delete survey with id of ${id}, as it does not exists.`;
  }
  return { _id: ObjectId.createFromHexString(id) };
}

export const updateSurvey = async(id) => {
  const getSurvey = await getSurveyById(id);
  
  return getSurvey;
  }

export const replaceSurvey = async(id, surveyName, startDate, endDate, userMappingData, status, selectedQuestions) => {
try {
    const surveyCollection = await survey();

    const oldSurvey = await getSurveyById(id); 
    console.log(userMappingData);
    const surveyCreated = oldSurvey.surveyCreated;
    const surveyQuestionList = oldSurvey.surveyQuestionList;
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

  
    const updatedData = {
      surveyCreated,
      surveyName: surveyName,
      startDate: startDate,
      endDate: endDate,
      surveyQuestionList,
      status: status,
      userMapping,
      selectedQuestions: selectedQuestions, 
    };
    
    const result = await surveyCollection.updateOne(
      { _id: ObjectId.createFromHexString(id) }, 
      { $set: updatedData } 
    );


    if (result.acknowledged === true) {
      const updatedSurvey = await getSurveyById(id); 
      console.log(updatedSurvey);
      
      return updatedSurvey;
    } else {
      throw new Error('Survey not updated');
    }
  } catch (error) {
    console.error('Error updating survey:', error);
    throw new Error('Failed to update survey');
  }

}