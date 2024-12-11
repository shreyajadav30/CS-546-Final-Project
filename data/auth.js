// import createHttpError from "http-errors";
// import { users } from "../config/mongoCollections.js";
// import { authSchema } from "../utils/validations/auth.js";
// import {
//   comparePassword,
//   generateHashPassword,
// } from "../utils/helpers/bcryptHelper.js";
// import { checkId } from "../utils/helpers/helpers.js";
// import { ObjectId } from "mongodb";

// const registerUser = async (email, password) => {
//   let validatedUserData = await authSchema.validateAsync({ email, password });
//   email = validatedUserData.email;
//   password = validatedUserData.password;

//   const usersCollection = await users();

//   const doesExist = await usersCollection.findOne({ email: email });
//   if (doesExist) throw `${email} is already been registered`;

//   password = await generateHashPassword(password);

//   let newUserObject = {
//     email,
//     password,
//   };
//   const insertedInfo = await usersCollection.insertOne(newUserObject);
//   if (!insertedInfo.acknowledged || !insertedInfo.insertedId)
//     throw "Could not user team to a database!!";

//   // console.log(insertedInfo.insertedId);

//   const newUser = await getUserById(insertedInfo.insertedId.toString());
//   return newUser;
// };

// const getUserById = async (id) => {
//   id = checkId(id, "User ID");

//   const usersCollection = await users();

//   const user = await usersCollection.findOne({
//     _id: ObjectId.createFromHexString(id),
//   });
//   if (!user) throw "No user with that id";
//   user._id = user._id.toString();
//   return user;
// };

// const loginUser = async (email, password) => {
//   let validatedUserData = await authSchema.validateAsync({ email, password });
//   email = validatedUserData.email;
//   password = validatedUserData.password;

//   const usersCollection = await users();

//   const user = await usersCollection.findOne({ email: email });
//   if (!user) throw `User with email ${email} is not registered!`;

//   const isCorrectPassword = await comparePassword(password, user.password);

//   if (!isCorrectPassword) {
//     throw `Username/password are not correct credentials!`;
//   }

//   return user;
// };
// export default { registerUser, getUserById, loginUser };
