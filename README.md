# CS-546-Final-Project: SurveySync

A platform designed to simplify the process of creating, distributing, and analyzing feedback surveys. It offers a comprehensive question bank, survey creator, and analytics of survey, enabling organizations to gather valuable insights to identify areas of improvement and make data driven decisions for professional development.

# GitHub repo

-   https://github.com/dhruvmojila/CS-546-Final-Project

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
ACCESS_TOKEN_SECRET="ACCESS_TOKEN_SECRET"
REFRESH_TOKEN_SECRET="REFRESH_TOKEN_SECRET"
EXPRESS_SESSION_SECRET="EXPRESS_SESSION_SECRET"
GROQ_API_KEY="GROQ_API_KEY"
```

## Credentials

-   Admin logins:
    userId: dmojila, vpatel
-   Users
    userId: sjadav, mdhami, gvaswani

Credentials: User@123 (Same for all users)
