import bcrypt from "bcryptjs";
const SALT_ROUNDS = 16;

export const generateHashPassword = async (
  password,
  saltRound = SALT_ROUNDS
) => {
  const hash = await bcrypt.hash(password, saltRound);
  return hash;
};

export const comparePassword = async (enteredPassword, dbPpassword) => {
  const compareToMatch = await bcrypt.compare(enteredPassword, dbPpassword);
  return compareToMatch;
};
