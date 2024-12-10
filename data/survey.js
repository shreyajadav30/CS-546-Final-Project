import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { survey } from "../config/mongoCollections.js"

export const addSurvey = async (
    surveyName,
    startDate,
    endDate,
    surveyQuestionList,
    status,
    // surveyedBy,
    userMapping
  ) => {
    const surveyCollection= await survey();
    const surveyData = {
        surveyName,
        startDate,
        endDate,
        surveyQuestionList,
        status,
        // surveyedBy,
        userMapping
    };
    const insertedSurvey = await surveyCollection.insertOne(surveyData);
  
    console.log(insertedSurvey);
    if (!insertedSurvey || !insertedSurvey.insertedId) {
      throw "Survey data is not inserted.";
    }
    const newId = insertedSurvey.insertedId.toString();
    //const user = await getUserById(newId);
    //console.log(newId);
    
    return insertedSurvey;
  };