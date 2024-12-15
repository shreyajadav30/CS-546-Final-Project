import { dbConnection } from "./config/mongoConnection.js";
import { MongoClient } from "mongodb";
import { mongoConfig } from "./config/settings.js";

let _connection = undefined;
let _db = undefined;

async function seedDatabase() {
  try {

    _connection = await MongoClient.connect(mongoConfig.serverUrl);
    _db = _connection.db(mongoConfig.database);
    console.log("MongoDb connected to db");

    const db = await dbConnection();

    // Access the collection
    const users = db.collection("users"); // Replace with your collection name
    const survey = db.collection('survey');
    const questions = db.collection('questions');

    // Define seed data
    const userData = [
        { firstName: "Alice", lastName: "Wolf", email: "alice@example.com", userId: "awolf", password:"$2a$16$b48IkpkvsNauHfZyRWNSLePnvSUpxXk2iSDmHF0QrzlMpNQgJTk6y", role:"admin"},
        { firstName: "Manav", lastName: "Dhami", email: "mdhami@gmail.com", userId: "mdhami", password:"$2a$16$b48IkpkvsNauHfZyRWNSLePnvSUpxXk2iSDmHF0QrzlMpNQgJTk6y", role:"user"},
        { firstName: "Shreya", lastName: "Jadav", email: "sjadav@example.com", userId: "sjadav", password:"$2a$16$b48IkpkvsNauHfZyRWNSLePnvSUpxXk2iSDmHF0QrzlMpNQgJTk6y", role:"user"},
        { firstName: "Vidhi", lastName: "Patel", email: "vpatel@example.com", userId: "vpatel", password:"$2a$16$b48IkpkvsNauHfZyRWNSLePnvSUpxXk2iSDmHF0QrzlMpNQgJTk6y", role:"user"},
        { firstName: "Dhruv", lastName: "Mojila", email: "dmojila@example.com", userId: "dmojila", password:"$2a$16$b48IkpkvsNauHfZyRWNSLePnvSUpxXk2iSDmHF0QrzlMpNQgJTk6y", role:"admin"},
        { firstName: "Gautam", lastName: "Vasvani", email: "gvasvani@example.com", userId: "gvasvani", password:"$2a$16$b48IkpkvsNauHfZyRWNSLePnvSUpxXk2iSDmHF0QrzlMpNQgJTk6y", role:"user"}
    ];

    const questionData = [{
        "categoryName": "Event Based",
        "questions": [
          {
            "questionId": "675b7ca79055a1ebf7d2f3b6",
            "questionText": "What is your feedback on this Event",
            "type": "text",
            "useCount": 0,
            "scale": ""
          },
          {
            "questionId": "675c00b3f0c567d26ad6aefc",
            "questionText": "Your experience for this event",
            "type": "single_select",
            "useCount": 0,
            "options": [
              "Good",
              "Excellent",
              "Best",
              "Bad"
            ]
          },
          {
            "questionId": "475c00b3f0c522d26ad6aefc",
            "questionText": "Rate this event",
            "type": "rating",
            "useCount": 0,
            "scale": "5"
          }
        ]
      },
      {
        "categoryName": "Health & Wellness",
        "questions": [
          {
            "questionId": "675c010b6d0cdc81e65ef9cd",
            "questionText": "How often do you visit a healthcare provider for check-ups?",
            "type": "single_select",
            "useCount": 0,
            "options": [
              "Once a year",
              "Twice a year",
              "Rarely",
              "Never"
            ]
          },
          {
            "questionId": "674a010b6d0cdc81e65ef9ab",
            "questionText": "How would you rate your overall physical health?",
            "type": "rating",
            "useCount": 0,
            "scale": "5"
          },
          {
            "questionId": "623a010b6d0cdc81e65ef9rr",
            "questionText": "How many hours of sleep do you get on average each night?",
            "type": "text",
            "useCount": 0,
            "scale": ""
          }
        ]
      },
      {
        "categoryName": "Teamwork",
        "questions": [
          {
            "questionId": "675c30077d0805609db0ab70",
            "questionText": "What is most important for you while working in a team.",
            "type": "multi_select",
            "useCount": 0,
            "options": [
              "Teamwork",
              "loadbalance",
              "communication"
            ]
          },
          {
            "questionId": "675c30787d0805609db0ab75",
            "questionText": "Do you like working with this person?",
            "type": "single_select",
            "useCount": 0,
            "options": [
              "Yes",
              "No"
            ]
          },
          {
            "questionId": "610c31177d0805609db0ab44",
            "questionText": "How often do team members assist one another when needed?",
            "type": "single_select",
            "useCount": 0,
            "options": [
              "Never",
              "Rarely",
              "Sometimes",
              "Always"
            ]
          },
          {
            "questionId": "620c31177d0805609db0ab11",
            "questionText": "Rate the team members based on your work exerience",
            "type": "rating",
            "useCount": 0,
            "scale":"5"
          }
        ]
      },
      {
        "categoryName": "miscellaneous",
        "questions": [
          {
            "questionId": "675c309d7d0805609db0ab76",
            "questionText": "Any extra comments?",
            "type": "text",
            "useCount": 0
          }
        ]
      }];
    
    const surveyData = [{
        "surveyCreated": "675d0618c1fb590c363cb0c2",
        "surveyName": "Team Engagement Survey",
        "startDate": "2024-12-10",
        "endDate": "2024-12-26",
        "surveyQuestionList": null,
        "status": "active",
        "userMapping": [
          {
            "surveyedFor": "675d352df23102cea187efdb",
            "surveyedBy": [
              "675d352df23102cea187efdd",
              "675d352df23102cea187efda",
              "675d352df23102cea187efd9",
              "675d352df23102cea187efdc",
              "675d352df23102cea187efde"
            ]
          },
          {
            "surveyedFor": "675d352df23102cea187efdd",
            "surveyedBy": [
              "675d352df23102cea187efdb",
              "675a78e451c35fa79f0fa4bb",
              "675d352df23102cea187efdc",
              "675d352df23102cea187efde",
              "675d352df23102cea187efda"
            ]
          }
        ],
        "selectedQuestions": {
          "Teamwork": [
            "675c30077d0805609db0ab70",
            "675c30787d0805609db0ab75",
            "610c31177d0805609db0ab44",
            "620c31177d0805609db0ab11"
          ],
          "miscellaneous": [
            "675c309d7d0805609db0ab76"
          ]
        }
      },
      {
        "surveyCreated": "675d352df23102cea187efdd",
        "surveyName": "Event Satisfaction Survey",
        "startDate": "2024-11-10",
        "endDate": "2024-12-30",
        "surveyQuestionList": null,
        "status": "active",
        "userMapping": [
          {
            "surveyedFor": "675d352df23102cea187efda",
            "surveyedBy": [
              "675d352df23102cea187efd9",
              "675d352df23102cea187efdc",
              "675d352df23102cea187efde"
            ]
          },
          {
            "surveyedFor": "675d352df23102cea187efdc",
            "surveyedBy": [
              "675d352df23102cea187efdb",
              "675a78e451c35fa79f0fa4bb",
              "675d352df23102cea187efde",
              "675d352df23102cea187efda"
            ]
          },
          {
            "surveyedFor": "675d352df23102cea187efde",
            "surveyedBy": [
              "675d352df23102cea187efdb",
              "675a78e451c35fa79f0fa4bb",
              "675d352df23102cea187efda",
              "675d352df23102cea187efdd"
            ]
          }
        ],
        "selectedQuestions": {
          "Event Based": [
            "675b7ca79055a1ebf7d2f3b6",
            "675c00b3f0c567d26ad6aefc",
            "475c00b3f0c522d26ad6aefc"
          ],
          "miscellaneous": [
            "675c309d7d0805609db0ab76"
          ]
        }
      },
      {
        "surveyCreated": "675d352df23102cea187efdc",
        "surveyName": "Wellness Program Survey",
        "startDate": "2024-11-10",
        "endDate": "2024-12-30",
        "surveyQuestionList": null,
        "status": "active",
        "userMapping": [
          {
            "surveyedFor": "675d352df23102cea187efd9",
            "surveyedBy": [
              "675d352df23102cea187efdc",
              "675d352df23102cea187efde",
              "675a78e451c35fa79f0fa4bb",
              "675d352df23102cea187efda",
              "675d352df23102cea187efdd"
            ]
          }
        ],
        "selectedQuestions": {
          "Health & Wellness": [
            "675c010b6d0cdc81e65ef9cd",
            "674a010b6d0cdc81e65ef9ab",
            "623a010b6d0cdc81e65ef9rr"
          ],
          "miscellaneous": [
            "675c309d7d0805609db0ab76"
          ]
        }
      }];
    const result1 = await users.insertMany(userData);
    const result2 = await questions.insertMany(questionData);
    const result3 = await survey.insertMany(surveyData);
    console.log(`${result1.insertedCount} documents inserted!`);
    console.log(`${result2.insertedCount} documents inserted!`);
    console.log(`${result3.insertedCount} documents inserted!`);

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await _connection.close();
  }
}

seedDatabase();
