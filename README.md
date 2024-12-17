# CS-546-Final-Project: SurveySync

A platform designed to simplify the process of creating, distributing, and analyzing feedback surveys. It offers a comprehensive question bank, survey creator, and analytics of survey, enabling organizations to gather valuable insights to identify areas of improvement and make data driven decisions for professional development.

# GitHub repo

-   https://github.com/dhruvmojila/CS-546-Final-Project

## Features

-   Create doctor, patient, chat and review
-   List of doctors
-   Send or update information about doctors and patients
-   List of timeslots of doctors according to availaibility
-   Book, update, delete appointment
-   Send email for reminder, confirmation, updation and deletion of appointment
-   Send information about chat and review

## Tech

-   [Node.js](https://nodejs.org/en/) - A JavaScript library for building an open-source server environment.

## Installation

Doctolib-Backend requires [Node.js](https://nodejs.org/) v10+ to run.

```sh
git clone git@github.com:ujasitalia/CS546-Final-Project.git
cd CS546-Final-Project
cd backend
git checkout master
npm install
npm run seed
npm start
```

## Features

-   User Sign Up and Login.
-   View, search, edit, update, and delete user records.
-   Update personal information.
-   View survey history for each user.
-   Create, edit, preview, delete, and categorize questions.
-   Organize questions by categories for reuse across surveys.
-   Create, edit, delete, and review surveys.
-   Set survey status: Active, Inactive, Draft, or Closed.
-   Publish surveys and assign them to participants.
-   Track participant progress and allow survey completion.
-   Send email notifications for pending surveys.
-   Map participant relationships manually (e.g., who evaluates whom).
-   Bulk upload participant details using Excel/CSV files.
-   View completion rates and basic response statistics.
-   Visualize data with simple charts and graphs.

## Installation

```sh
git clone https://github.com/dhruvmojila/CS-546-Final-Project.git
cd CS-546-Final-Project
npm install
npm run seed
npm start
```

## Create .env file in root folder

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/
DB_NAME=SurveySync
ACCESS_TOKEN_SECRET=55c8364c4427ef1b73d24ad1e3306fd7c8bcf8796ed4f8dbf9b754c6cbdf7dab
REFRESH_TOKEN_SECRET=fed32016abc2aa19a1146943c363e3a8111cd7385652cf44ebd4ced733d5b522
EXPRESS_SESSION_SECRET=9604f33b7d4c1241c97cada27c0a66315d4ef928c66c6b386c1e365c53714fff
GROQ_API_KEY=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
```

## Credentials

-   Admin logins:
    userId: dmojila, vpatel
-   Users
    userId: sjadav, mdhami, gvaswani

Credentials: User@123 (Same for all users)
