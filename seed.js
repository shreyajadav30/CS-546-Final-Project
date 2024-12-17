import { dbConnection } from "./config/mongoConnection.js";
import { MongoClient } from "mongodb";
import { mongoConfig } from "./config/settings.js";
import { ObjectId } from "mongodb";

let _connection = undefined;
let _db = undefined;

async function seedDatabase() {
  try {

    _connection = await MongoClient.connect(mongoConfig.serverUrl);
    _db = _connection.db(mongoConfig.database);
    console.log("MongoDb connected to db");

    if(_db){
        await _db.dropDatabase();
        console.log('Exsisting DB dropped');
        
    }
    const users = _db.collection("users");
    const survey = _db.collection('survey');
    const questions = _db.collection('questions');
    const surveyAnswer = _db.collection("surveyAnswer");
    const userData = [{
        "_id": new ObjectId("675d352df23102cea187efd9"),
        "firstName": "Alice",
        "lastName": "Wolf",
        "email": "alice@example.com",
        "userId": "awolf",
        "password": "$2a$16$b48IkpkvsNauHfZyRWNSLePnvSUpxXk2iSDmHF0QrzlMpNQgJTk6y",
        "role": "admin",
        "surveys": [
          {
            "surveyId": new ObjectId("675e1a06807f1c0fbc0fc794"),
            "surveyingFor": [
              "675d352df23102cea187efdb"
            ]
          },
          {
            "surveyId": new ObjectId("675e1a06807f1c0fbc0fc795"),
            "surveyingFor": [
              "675d352df23102cea187efda"
            ]
          }
        ]
      },
      {
        "_id": new ObjectId("675d352df23102cea187efda"),
        "firstName": "Manav",
        "lastName": "Dhami",
        "email": "mdhami@gmail.com",
        "userId": "mdhami",
        "password": "$2a$16$b48IkpkvsNauHfZyRWNSLePnvSUpxXk2iSDmHF0QrzlMpNQgJTk6y",
        "role": "user",
        "surveys": [
          {
            "surveyId": new ObjectId ("675e1a06807f1c0fbc0fc794"),
            "surveyingFor": [
              "675d352df23102cea187efdb",
              "675d352df23102cea187efdd"
            ]
          },
          {
            "surveyId": new ObjectId ("675e1a06807f1c0fbc0fc795"),
            "surveyingFor": [
              "675d352df23102cea187efdc",
              "675d352df23102cea187efde",
              "675d352df23102cea187efda"
            ]
          },
          {
            "surveyId": new ObjectId ("675e1a06807f1c0fbc0fc796"),
            "surveyingFor": [
              "675d352df23102cea187efd9"
            ]
          }
        ]
      },
      {
        "_id": new ObjectId("675d352df23102cea187efdb"),
        "firstName": "Shreya",
        "lastName": "Jadav",
        "email": "sjadav@example.com",
        "userId": "sjadav",
        "password": "$2a$16$b48IkpkvsNauHfZyRWNSLePnvSUpxXk2iSDmHF0QrzlMpNQgJTk6y",
        "role": "user",
        "surveys": [
          {
            "surveyId": new ObjectId("675e1a06807f1c0fbc0fc794"),
            "surveyingFor": [
              "675d352df23102cea187efda",
              "675d352df23102cea187efdd"
            ]
          },
          {
            "surveyId": new ObjectId("675e1a06807f1c0fbc0fc795"),
            "surveyingFor": [
              "675d352df23102cea187efdc",
              "675d352df23102cea187efde"
            ]
          }
        ]
      },
      {
        "_id": new ObjectId("675d352df23102cea187efdc"),
        "firstName": "Vidhi",
        "lastName": "Patel",
        "email": "vpatel@example.com",
        "userId": "vpatel",
        "password": "$2a$16$b48IkpkvsNauHfZyRWNSLePnvSUpxXk2iSDmHF0QrzlMpNQgJTk6y",
        "role": "admin",
        "surveys": [
          {
            "surveyId": new ObjectId("675e1a06807f1c0fbc0fc794"),
            "surveyingFor": [
              "675d352df23102cea187efdb",
              "675d352df23102cea187efdd"
            ]
          },
          {
            "surveyId": new ObjectId("675e1a06807f1c0fbc0fc795"),
            "surveyingFor": [
              "675d352df23102cea187efda",
              "675d352df23102cea187efdc"
            ]
          },
          {
            "surveyId": new ObjectId("675e1a06807f1c0fbc0fc796"),
            "surveyingFor": [
              "675d352df23102cea187efd9"
            ]
          }
        ]
      },
      {
        "_id": new ObjectId("675d352df23102cea187efdd"),
        "firstName": "Dhruv",
        "lastName": "Mojila",
        "email": "dmojila@example.com",
        "userId": "dmojila",
        "password": "$2a$16$b48IkpkvsNauHfZyRWNSLePnvSUpxXk2iSDmHF0QrzlMpNQgJTk6y",
        "role": "admin",
        "surveys": [
          {
            "surveyId": new ObjectId ("675e1a06807f1c0fbc0fc794"),
            "surveyingFor": [
              "675d352df23102cea187efdb"
            ]
          },
          {
            "surveyId": new ObjectId ("675e1a06807f1c0fbc0fc795"),
            "surveyingFor": [
              "675d352df23102cea187efde"
            ]
          },
          {
            "surveyId": new ObjectId ("675e1a06807f1c0fbc0fc796"),
            "surveyingFor": [
              "675d352df23102cea187efd9"
            ]
          }
        ]
      },
      {
        "_id": new ObjectId("675d352df23102cea187efde"),
        "firstName": "Gautam",
        "lastName": "Vasvani",
        "email": "gvaswani@example.com",
        "userId": "gvaswani",
        "password": "$2a$16$b48IkpkvsNauHfZyRWNSLePnvSUpxXk2iSDmHF0QrzlMpNQgJTk6y",
        "role": "user",
        "surveys": [
          {
            "surveyId": new ObjectId ("675e1a06807f1c0fbc0fc794"),
            "surveyingFor": [
              "675d352df23102cea187efdb",
              "675d352df23102cea187efdd"
            ]
          },
          {
            "surveyId": new ObjectId ("675e1a06807f1c0fbc0fc795"),
            "surveyingFor": [
              "675d352df23102cea187efda",
              "675d352df23102cea187efdc"
            ]
          },
          {
            "surveyId": new ObjectId ("675e1a06807f1c0fbc0fc796"),
            "surveyingFor": [
              "675d352df23102cea187efd9"
            ]
          }
        ]
      },
      {
        "_id": new ObjectId("675f2f7285e4f16f43308be5"),
        "firstName": "Dipesh",
        "lastName": "Balar",
        "email": "dipesh.balar@brainvire.com",
        "userId": "dbalar",
        "password": "$2a$16$GNeCzrVFFwVGwh3MZ0aDPuA9vKSFTBeF61wQ23YHoMCTZzO65JdDG",
        "role": "user",
        "surveys": [
            {
                "surveyId": new ObjectId ("675e1a06807f1c0fbc0fc794"),
                "surveyingFor": [
                  "675d352df23102cea187efdb",
                  "675f303285e4f16f43308be7",
                  "675f2fd985e4f16f43308be6"
                ]
              },
              {
                "surveyId": new ObjectId ("675e1a06807f1c0fbc0fc795"),
                "surveyingFor": [
                  "675d352df23102cea187efda",
                  "675d352df23102cea187efdc",
                  "675e1a06807f1c0fbc0fc794"
                ]
              }
        ]
      },
      {
        "_id": ("675f2fd985e4f16f43308be6"),
        "firstName": "Jay",
        "lastName": "Patel",
        "email": "jaypatel@gmail.com",
        "userId": "jpatel",
        "password": "$2a$16$cwnT/MviicqSYhtsDI83h.ZROgRylBWM8xb4KSCl6M/Eyth1jaFeK",
        "role": "admin",
        "surveys": [
            {
                "surveyId": new ObjectId("675e1a06807f1c0fbc0fc794"),
                "surveyingFor": [
                  "675d352df23102cea187efda",
                  "675d352df23102cea187efdd"
                ]
            },
            {
                "surveyId": new ObjectId("675e1a06807f1c0fbc0fc795"),
                "surveyingFor": [
                  "675d352df23102cea187efdc",
                  "675d352df23102cea187efde"
                ]
            }
        ]
      },
      {
        "_id": new ObjectId("675f30aa85e4f16f43308be8"),
        "firstName": "Michel",
        "lastName": "Brooks",
        "email": "mbrooks@gmail.com",
        "userId": "mbrooks",
        "password": "$2a$16$4r6XcZlKMeyieKAfBrwffOr3dvt7M2g7ROEsE5v4gk4TLZvnO/CpC",
        "role": "user",
        "surveys": [
            {
                "surveyId": new ObjectId("675e1a06807f1c0fbc0fc794"),
                "surveyingFor": [
                  "675d352df23102cea187efda",
                  "675d352df23102cea187efdd"
                ]
            },
            {
                "surveyId": new ObjectId("675e1a06807f1c0fbc0fc795"),
                "surveyingFor": [
                  "675d352df23102cea187efdc",
                  "675d352df23102cea187efde"
                ]
            }
        ]
      },
      {
        "_id":new ObjectId("675f312285e4f16f43308be9"),
        "firstName": "Taylor",
        "lastName": "Morgan",
        "email": "tmorgan@gmail.com",
        "userId": "tmorgan",
        "password": "$2a$16$mA8yYQLWJvyuCnmrIhRWtOUUGBK8FrnOVtKHU1mag.itlWU4YsxQi",
        "role": "user",
        "surveys": [
            {
                "surveyId": new ObjectId("675e1a06807f1c0fbc0fc795"),
                "surveyingFor": [
                  "675d352df23102cea187efda",
                  "675d352df23102cea187efdc"
                ]
            },
            {
                "surveyId": new ObjectId("675e1a06807f1c0fbc0fc796"),
                "surveyingFor": [
                  "675d352df23102cea187efd9"
                ]
            }
        ]
      }]; 

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
        "_id": new ObjectId("675e1a06807f1c0fbc0fc794"),
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
              "675d352df23102cea187efda",
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
        "_id" : new ObjectId("675e1a06807f1c0fbc0fc795"),
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
              "675d352df23102cea187efda",
              "675d352df23102cea187efde",
              "675d352df23102cea187efda"
            ]
          },
          {
            "surveyedFor": "675d352df23102cea187efde",
            "surveyedBy": [
              "675d352df23102cea187efdb",
              "675d352df23102cea187efda",
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
        "_id": new ObjectId("675e1a06807f1c0fbc0fc796"),
        "surveyCreated": "675d352df23102cea187efdc",
        "surveyName": "Wellness Program Survey",
        "startDate": "2024-12-10",
        "endDate": "2025-02-26",
        "surveyQuestionList": null,
        "status": "active",
        "userMapping": [
          {
            "surveyedFor": "675d352df23102cea187efd9",
            "surveyedBy": [
              "675d352df23102cea187efdc",
              "675d352df23102cea187efde",
              "675d352df23102cea187efda",
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
    const answerData = [{
        "_id": new ObjectId( "675f3b8711ca04a309c2a1fe"),
        "surveyId": "675e1a06807f1c0fbc0fc794",
        "surveydBy": "675f30aa85e4f16f43308be8",
        "surveyingFor": "675d352df23102cea187efda",
        "answers": {
          "675c30077d0805609db0ab70": [
            "loadbalance",
            "communication"
          ],
          "675c30787d0805609db0ab75": "Yes",
          "610c31177d0805609db0ab44": "Rarely",
          "620c31177d0805609db0ab11": 4,
          "675c309d7d0805609db0ab76": "no comment"
        },
        "submittedAt": "12-2024-15"
      },
      {
        "_id": new ObjectId ("675f3b9511ca04a309c2a1ff"),
        "surveyId": "675e1a06807f1c0fbc0fc795",
        "surveydBy": "675f30aa85e4f16f43308be8",
        "surveyingFor": "675d352df23102cea187efdc",
        "answers": {
          "675b7ca79055a1ebf7d2f3b6": "good",
          "675c00b3f0c567d26ad6aefc": "Good",
          "475c00b3f0c522d26ad6aefc": 4,
          "675c309d7d0805609db0ab76": "no comment"
        },
        "submittedAt": "12-2024-15"
      },
      {
        "_id": new ObjectId( "675f3d9e11ca04a309c2a200"),
        "surveyId": "675e1a06807f1c0fbc0fc795",
        "surveydBy": "675f30aa85e4f16f43308be8",
        "surveyingFor": "675d352df23102cea187efde",
        "answers": {
          "675b7ca79055a1ebf7d2f3b6": "best",
          "675c00b3f0c567d26ad6aefc": "Good",
          "475c00b3f0c522d26ad6aefc": 4,
          "675c309d7d0805609db0ab76": "no comments"
        },
        "submittedAt": "12-2024-15"
      },
      {
        "_id": new ObjectId( "675f3dcd11ca04a309c2a201"),
        "surveyId": "675e1a06807f1c0fbc0fc794",
        "surveydBy": "675d352df23102cea187efdb",
        "surveyingFor": "675d352df23102cea187efda",
        "answers": {
          "675c30077d0805609db0ab70": [
            "loadbalance",
            "communication"
          ],
          "675c30787d0805609db0ab75": "Yes",
          "610c31177d0805609db0ab44": "Sometimes",
          "620c31177d0805609db0ab11": 4,
          "675c309d7d0805609db0ab76": "no"
        },
        "submittedAt": "12-2024-15"
      },
      {
        "_id": new ObjectId( "675f3de811ca04a309c2a202"),
        "surveyId": "675e1a06807f1c0fbc0fc795",
        "surveydBy": "675d352df23102cea187efdb",
        "surveyingFor": "675d352df23102cea187efdc",
        "answers": {
          "675b7ca79055a1ebf7d2f3b6": "best",
          "675c00b3f0c567d26ad6aefc": "Good",
          "475c00b3f0c522d26ad6aefc": 3,
          "675c309d7d0805609db0ab76": "no"
        },
        "submittedAt": "12-2024-15"
      },
      {
        "_id": new ObjectId( "675f3e1311ca04a309c2a203"),
        "surveyId": "675e1a06807f1c0fbc0fc794",
        "surveydBy": "675d352df23102cea187efda",
        "surveyingFor": "675d352df23102cea187efdb",
        "answers": {
          "675c30077d0805609db0ab70": [
            "Teamwork",
            "loadbalance",
            "communication"
          ],
          "675c30787d0805609db0ab75": "Yes",
          "610c31177d0805609db0ab44": "Always",
          "620c31177d0805609db0ab11": 5,
          "675c309d7d0805609db0ab76": "no"
        },
        "submittedAt": "12-2024-15"
      },
      {
        "_id": new ObjectId( "675f3e2611ca04a309c2a204"),
        "surveyId": "675e1a06807f1c0fbc0fc795",
        "surveydBy": "675d352df23102cea187efda",
        "surveyingFor": "675d352df23102cea187efda",
        "answers": {
          "675b7ca79055a1ebf7d2f3b6": "best",
          "675c00b3f0c567d26ad6aefc": "Best",
          "475c00b3f0c522d26ad6aefc": 3,
          "675c309d7d0805609db0ab76": "no"
        },
        "submittedAt": "12-2024-15"
      },
      {
        "_id": new ObjectId( "675f3e5111ca04a309c2a205"),
        "surveyId": "675e1a06807f1c0fbc0fc795",
        "surveydBy": "675d352df23102cea187efdd",
        "surveyingFor": "675d352df23102cea187efde",
        "answers": {
          "675b7ca79055a1ebf7d2f3b6": "mind blowing",
          "675c00b3f0c567d26ad6aefc": "Excellent",
          "475c00b3f0c522d26ad6aefc": 5,
          "675c309d7d0805609db0ab76": "no"
        },
        "submittedAt": "12-2024-15"
      },
      {
        "_id": new ObjectId( "675f3e7f11ca04a309c2a206"),
        "surveyId": "675e1a06807f1c0fbc0fc794",
        "surveydBy": "675d352df23102cea187efdc",
        "surveyingFor": "675d352df23102cea187efdd",
        "answers": {
          "675c30077d0805609db0ab70": [
            "Teamwork"
          ],
          "675c30787d0805609db0ab75": "No",
          "610c31177d0805609db0ab44": "Never",
          "620c31177d0805609db0ab11": 1,
          "675c309d7d0805609db0ab76": "no"
        },
        "submittedAt": "12-2024-15"
      },
      {
        "_id": new ObjectId( "675f3e9011ca04a309c2a207"),
        "surveyId": "675e1a06807f1c0fbc0fc795",
        "surveydBy": "675d352df23102cea187efdc",
        "surveyingFor": "675d352df23102cea187efdc",
        "answers": {
          "675b7ca79055a1ebf7d2f3b6": "good",
          "675c00b3f0c567d26ad6aefc": "Excellent",
          "475c00b3f0c522d26ad6aefc": 2,
          "675c309d7d0805609db0ab76": "no"
        },
        "submittedAt": "12-2024-15"
      },
      {
        "_id": new ObjectId( "675f3ec011ca04a309c2a208"),
        "surveyId": "675e1a06807f1c0fbc0fc794",
        "surveydBy": "675d352df23102cea187efde",
        "surveyingFor": "675d352df23102cea187efdd",
        "answers": {
          "675c30077d0805609db0ab70": [
            "loadbalance",
            "communication"
          ],
          "675c30787d0805609db0ab75": "No",
          "610c31177d0805609db0ab44": "Rarely",
          "620c31177d0805609db0ab11": 3,
          "675c309d7d0805609db0ab76": "no"
        },
        "submittedAt": "12-2024-15"
      },
      {
        "_id": new ObjectId( "675f3ecf11ca04a309c2a209"),
        "surveyId": "675e1a06807f1c0fbc0fc796",
        "surveydBy": "675d352df23102cea187efde",
        "surveyingFor": "675d352df23102cea187efd9",
        "answers": {
          "675c010b6d0cdc81e65ef9cd": "Twice a year",
          "674a010b6d0cdc81e65ef9ab": 3,
          "623a010b6d0cdc81e65ef9rr": "6",
          "675c309d7d0805609db0ab76": "no"
        },
        "submittedAt": "12-2024-15"
      }];

    const result1 = await users.insertMany(userData);
    const result2 = await questions.insertMany(questionData);
    const result3 = await survey.insertMany(surveyData);
    const result4 = await surveyAnswer.insertMany(answerData);

    console.log(`${result1.insertedCount} userData inserted!`);
    console.log(`${result2.insertedCount} questionData inserted!`);
    console.log(`${result3.insertedCount} surveyData inserted!`);
    console.log(`${result4.insertedCount} answerData inserted!`);

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await _connection.close();
  }
}

seedDatabase();
