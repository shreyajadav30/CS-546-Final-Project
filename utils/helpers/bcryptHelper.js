import bcrypt from "bcryptjs";
const SALT_ROUNDS = 16;

// export const generateHashPassword = async (
//   password,
//   saltRound = SALT_ROUNDS
// ) => {
//   const hash = await bcrypt.hash(password, saltRound);
//   return hash;
// };

// export const comparePassword = async (enteredPassword, dbPpassword) => {
//   const compareToMatch = await bcrypt.compare(enteredPassword, dbPpassword);
//   return compareToMatch;
// };

// Reference for password regex https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a/49359131

export const isValidPassword = (password) => {
  let regexForPassword = /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9]).{8,}$/;

  if (password.length < 8) {
    throw `Error: Password must be 8 characters long!`;
  }

  if (!regexForPassword.test(password)) {
    throw `Error: Password must have one uppercase letter, number and  special character!`;
  }

  password.split("").map((char) => {
    if (char === " " || char === "") {
      throw `Error: Password must not contain any space!`;
    }
  });

  return password;
};

export const generateHashPassword = async (
  password,
  saltRound = SALT_ROUNDS
) => {
  password = password.trim();

  let regexForPassword = /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9]).{8,}$/;

  if (password.length < 8) {
    throw `Error: Password must be 8 characters long!`;
  }

  if (!regexForPassword.test(password)) {
    throw `Error: Password must have one uppercase letter, number and  special character!`;
  }
  const hash = await bcrypt.hash(password, saltRound);
  return hash;
};

export const comparePassword = async (enteredPassword, dbPpassword) => {
  const compareToMatch = await bcrypt.compare(enteredPassword, dbPpassword);
  return compareToMatch;
};
