// This data file should export all functions using the ES6 standard as shown in the lecture code
import { users } from "../config/mongoCollections.js";
// import { validateInputsTeams, validateInputsId } from "../helpers.js";
import { ObjectId } from "mongodb";

export const AddUser = async (
  firstName,
  lastName,
  email,
  password,
  username,
  role,
  survey
) => {
  const usersCollection = await users();
  const userData = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    username: username,
    role: role,
    survey: survey,
  };
  const insertedUser = await usersCollection.insertOne(userData);

  if (!insertedUser || !insertedUser.insertedId) {
    throw "User data is not inserted.";
  }
  const newId = insertedUser.insertedId.toString();
  const user = await getUserById(newId);

  return user;
};

export const getAllUsers = async () => {
  const usersCollection = await users();
  let userList = await usersCollection.find({}).toArray();
  if (!userList) throw "Could not get all teams.";
  userList = userList.map((element) => {
    element._id = element._id.toString();
    return element;
  });
  return userList;
};

export const getUserById = async (id) => {
  // validateInputsId(id);

  const usersCollection = await users();
  const userbyid = await usersCollection.findOne({ _id: new ObjectId(id) });
  if (userbyid === null) throw "No user with that id.";
  userbyid._id = userbyid._id.toString();
  return userbyid;
};

export const removeUser = async (id) => {
  // validateInputsId(id);
  const usersCollection = await users();
  const userdeletionInfo = await usersCollection.findOneAndDelete({
    _id: ObjectId.createFromHexString(id),
  });

  if (!userdeletionInfo) {
    throw `Could not delete team with id of ${id}, as it doesnot exists.`;
  }
  return { _id: ObjectId.createFromHexString(id) };
};

export const updateUser = async (
  _id,
  firstName,
  lastName,
  email,
  password,
  username,
  role,
  survey
) => {
  // validateInputsId(id.trim());

  const usersCollection = await users();

  const updateUserData = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    password: password.trim(),
    username: username.trim(),
    role: role.trim(),
    survey: survey.trim(),
  };

  const updatedUserInfo = await usersCollection.updateOne(
    { _id: ObjectId.createFromHexString(_id) },
    { $set: updateUserData }
  );

  if (!updatedUserInfo) {
    throw "could not update team successfully because it doesnot exists anymore.";
  }
  return updatedUserInfo;
};
