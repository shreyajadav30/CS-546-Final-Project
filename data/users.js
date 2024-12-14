// This data file should export all functions using the ES6 standard as shown in the lecture code
import { users } from "../config/mongoCollections.js";
// import { validateInputsTeams, validateInputsId } from "../helpers.js";
import { ObjectId } from "mongodb";
import {
  checkId,
  checkString,
  isContainsNumber,
  isValidEmail,
} from "../utils/helpers/helpers.js";
import {
  comparePassword,
  generateHashPassword,
  isValidPassword,
} from "../utils/helpers/bcryptHelper.js";

export const signUpUser = async (
  firstName,
  lastName,
  userId,
  password,
  role,
  email
) => {
  let errors = [];

  const usersCollection = await users();
  try {
    firstName = checkString(firstName, "firstName");
    let hasNumber = isContainsNumber(firstName);
    if (hasNumber) {
      throw "It is not allowed to have number in firstname!!";
    }
    if (firstName.length < 2 || firstName.length > 25) {
      throw "firstname should be at least 2 characters long with a max of 25 characters!!";
    }
  } catch (e) {
    errors.push(e);
  }

  try {
    lastName = checkString(lastName, "lastName");
    let hasNumber = isContainsNumber(lastName);
    if (hasNumber) {
      throw "It is not allowed to have number in lastName!!";
    }
    if (lastName.length < 2 || lastName.length > 25) {
      throw "lastName should be at least 2 characters long with a max of 25 characters!!";
    }
  } catch (e) {
    errors.push(e);
  }
  try {
    email = checkString(email, "email");
    if (!isValidEmail(email)) {
      throw "Invalid email!!";
    }
    const user = await usersCollection.findOne({
      email: { $regex: new RegExp(email, "i") },
    });

    if (user) {
      throw "Email already exist!";
    }
  } catch (e) {
    errors.push(e);
  }
  try {
    userId = checkString(userId, "userId");
    let hasNumber = isContainsNumber(userId);
    if (hasNumber) {
      throw "It is not allowed to have number in userId!!";
    }
    if (userId.length < 5 || userId.length > 10) {
      throw "userId should be at least 5 characters long with a max of 10 characters!!";
    }

    // mongo check case insensitvely : ref: https://stackoverflow.com/questions/8246019/case-insensitive-search-in-mongo

    const user = await usersCollection.findOne({
      userId: { $regex: new RegExp(userId, "i") },
    });

    if (user) {
      throw "UserId already exist!";
    }
  } catch (e) {
    errors.push(e);
  }

  try {
    password = checkString(password, "password");
    password = isValidPassword(password);
  } catch (e) {
    errors.push(e);
  }

  try {
    role = checkString(role, "role");
    role = role.toLowerCase();
    if (role !== "admin" && role !== "user") {
      throw `Only valid roles are admin and user! ${role} can not be role!!`;
    }
  } catch (e) {
    errors.push(e);
  }

  password = await generateHashPassword(password);

  if (errors.length > 0) {
    return {
      registrationCompleted: false,
      errors,
    };
  }

  const newUserObj = {
    firstName,
    lastName,
    email,
    userId,
    password,
    role,
    surveys: [],
  };

  const insertedInfo = await usersCollection.insertOne(newUserObj);
  if (!insertedInfo.acknowledged || !insertedInfo.insertedId)
    throw "Could not add user to a database!!";
  return { registrationCompleted: true };
};

export const signInUser = async (userId, password) => {
  let errors = [];
  const usersCollection = await users();
  let user;

  try {
    userId = checkString(userId, "userId");
    let hasNumber = isContainsNumber(userId);
    if (hasNumber) {
      throw "It is not allowed to have number in userId!!";
    }
    if (userId.length < 5 || userId.length > 10) {
      throw "userId should be at least 5 characters long with a max of 10 characters!!";
    }
  } catch (e) {
    errors.push(e);
  }

  try {
    password = checkString(password, "password");
    password = isValidPassword(password);
  } catch (e) {
    errors.push(e);
  }

  try {
    // mongo check case insensitvely : ref: https://stackoverflow.com/questions/8246019/case-insensitive-search-in-mongo

    user = await usersCollection.findOne({
      userId: { $regex: new RegExp(`^${userId}$`, "i") },
    });

    if (!user) {
      throw "Either the userId or password is invalid";
    }

    let isCorrectPassword = await comparePassword(password, user.password);

    if (!isCorrectPassword) {
      throw "Either the userId or password is invalid";
    }
  } catch (e) {
    errors.push(e);
  }

  if (errors.length > 0) {
    return {
      hasError: true,
      errors,
    };
  }

  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    userId: user.userId,
    email: user.email,
    role: user.role,
  };
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
  const usersCollection = await users();
  let errors = [];
  try {
    id = checkId(id, "id");
  } catch (e) {
    errors.push(e);
  }
  if (errors.length > 0) {
    // console.log('errrrrrr', errors);
    return {
      hasError: true,
      errors,
    };
  }
  // validateInputsId(id);

  const userbyid = await usersCollection.findOne({ _id: new ObjectId(id) });
  if (userbyid === null) throw "No user with that id.";
  userbyid._id = userbyid._id.toString();
  return userbyid;
};
export const getUserByUserId = async (userId) => {
  const usersCollection = await users();
  let errors = [];
  try {
    userId = checkString(userId, "id");
  } catch (e) {
    errors.push(e);
  }
  if (errors.length > 0) {
    // console.log('errrrrrr', errors);
    return {
      hasError: true,
      errors,
    };
  }
  // validateInputsId(id);

  const userbyid = await usersCollection.findOne({ userId: userId });
  if (userbyid === null) throw "No user with that id.";
  userbyid._id = userbyid._id.toString();
  return userbyid;
};
export const getAllUserWithProvidedIds = async (ids) => {
  if (!ids) {
    return [];
  }
  // validateInputsId(id);
  const objectIds = ids.map((id) => ObjectId.createFromHexString(id));

  const usersCollection = await users();
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
  let userbyid = await usersCollection
    .find({ _id: { $in: objectIds } })
    .toArray();

  if (!userbyid) throw "No user with that id.";
  // userbyid = userbyid.map((id) => id.toString());
  return userbyid;
};

export const removeUser = async (id) => {
  const usersCollection = await users();
  let errors = [];
  try {
    id = checkId(id, "id");
  } catch (e) {
    errors.push(e);
  }
  if (errors.length > 0) {
    // console.log('errrrrrr', errors);
    return {
      hasError: true,
      errors,
    };
  }
  // validateInputsId(id);
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
  userId,
  role
) => {
  const usersCollection = await users();
  let errors = [];
  try {
    _id = checkId(_id, "id");
  } catch (e) {
    errors.push(e);
  }
  try {
    firstName = checkString(firstName, "firstName");
    let hasNumber = isContainsNumber(firstName);
    if (hasNumber) {
      throw "It is not allowed to have number in firstname!!";
    }
    if (firstName.length < 2 || firstName.length > 25) {
      throw "firstname should be at least 2 characters long with a max of 25 characters!!";
    }
  } catch (e) {
    errors.push(e);
  }
  try {
    lastName = checkString(lastName, "lastName");
    let hasNumber = isContainsNumber(lastName);
    if (hasNumber) {
      throw "It is not allowed to have number in lastName!!";
    }
    if (lastName.length < 2 || lastName.length > 25) {
      throw "lastName should be at least 2 characters long with a max of 25 characters!!";
    }
  } catch (e) {
    errors.push(e);
  }
  try {
    email = checkString(email, "email");
    if (!isValidEmail(email)) {
      throw "Invalid email!!";
    }
  } catch (e) {
    errors.push(e);
  }
  try {
    userId = checkString(userId, "userId");
    let hasNumber = isContainsNumber(userId);
    if (hasNumber) {
      throw "It is not allowed to have number in userId!!";
    }
    if (userId.length < 5 || userId.length > 10) {
      throw "userId should be at least 5 characters long with a max of 10 characters!!";
    }
  } catch (e) {
    errors.push(e);
  }
  try {
    role = checkString(role, "role");
    role = role.toLowerCase();
    if (role !== "admin" && role !== "user") {
      throw `Only valid roles are admin and user! ${role} can not be role!!`;
    }
  } catch (e) {
    errors.push(e);
  }
  if (errors.length > 0) {
    // console.log('errrrrrr', errors);
    return {
      hasError: true,
      errors,
    };
  }

  const updateUserData = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    userId: userId.trim(),
    role: role.trim(),
  };
  // console.log('111111', updateUserData);

  const updatedUserInfo = await usersCollection.updateOne(
    { _id: ObjectId.createFromHexString(_id) },
    { $set: updateUserData }
  );

  // console.log('2222', updatedUserInfo);

  if (!updatedUserInfo) {
    throw "could not update user successfully because it doesnot exists anymore.";
  }
  return updatedUserInfo;
};

export const searchUser = async (name) => {
  const usersCollection = await users();
  let errors = [];
  try {
    name = checkString(name, "searchTerm");
    let hasNumber = isContainsNumber(name);
    if (hasNumber) {
      throw "It is not allowed to have number in userId!!";
    }
  } catch (e) {
    // console.log('123eeee',e);
    errors.push(e);
  }
  if (errors.length > 0) {
    // console.log('errrrrrr', errors);
    return {
      hasError: true,
      errors,
    };
  }
  // validateInputsId(id);
  name = name.trim();
  // console.log('name...',name);
  let userName = [];
  // console.log('[[[[[[[');
  const query = {
    $or: [
      { firstName: { $regex: name, $options: "i" } },
      { lastName: { $regex: name, $options: "i" } },
      { email: { $regex: name, $options: "i" } },
    ],
  };
  userName = await usersCollection.find(query).limit(50).toArray();
  // console.log('query', userName);
  if (userName === null) throw "No user with that name found.";
  return userName;
};
