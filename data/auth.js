import createHttpError from "http-errors";
import { users } from "../config/mongoCollections.js";
import { authSchema } from "../utils/validations/auth.js";

const registerUser = async (email, password) => {
  let validatedUserData = await authSchema.validateAsync({ email, password });
  email = validatedUserData.email;
  password = validatedUserData.password;

  const usersCollection = await users();

  const doesExist = await usersCollection.findOne({ email: email });
  if (doesExist) throw `${email} is already been registered`;

  let newUserObject = {
    email,
    password,
  };
  const insertedInfo = await usersCollection.insertOne(newUserObject);
  if (!insertedInfo.acknowledged || !insertedInfo.insertedId)
    throw "Could not user team to a database!!";

  return {
    email,
    password,
  };
};

export default { registerUser };
