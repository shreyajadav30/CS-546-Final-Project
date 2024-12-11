// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// import createHttpError from "http-errors";

// import { authDataFunctions } from "../../data/index.js";

// dotenv.config();

// export const createAccessToken = async (userId) => {
//   return new Promise((res, rej) => {
//     const payload = {};
//     const secret = process.env.ACCESS_TOKEN_SECRET;
//     const options = {
//       expiresIn: "1h",
//       issuer: "dhruvmojila.com",
//       audience: userId.toString(),
//     };
//     jwt.sign(payload, secret, options, (err, token) => {
//       if (err) {
//         console.log(err.message);
//         rej(createHttpError.InternalServerError());
//         return;
//       }
//       res(token);
//     });
//   });
// };

// export const verifyAccessTokenMiddleware = async (req, res, next) => {
//   const userAccessToken = req.cookies.accessToken;

//   if (userAccessToken) {
//     jwt.verify(
//       userAccessToken,
//       process.env.ACCESS_TOKEN_SECRET,
//       (err, payload) => {
//         if (err) {
//           const message =
//             err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
//           return res.redirect("/auth/login");
//         } else {
//           // req.payload = payload;
//           next();
//         }
//       }
//     );
//   } else {
//     res.redirect("/auth/login");
//   }

//   // if (!req.headers["authorization"])
//   //   return next(createHttpError.Unauthorized());

//   // const authHeader = req.headers["authorization"];
//   // const bearerToken = authHeader.split(" ");
//   // const token = bearerToken[1];

//   // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
//   //   if (err) {
//   //     const message =
//   //       err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
//   //     return next(createHttpError.Unauthorized(message));
//   //   }
//   //   req.payload = payload;
//   //   next();
//   // });
// };

// export const verifyAccessTokenForLoginRegister = async (req, res, next) => {
//   const userAccessToken = req.cookies.accessToken;

//   if (userAccessToken) {
//     jwt.verify(
//       userAccessToken,
//       process.env.ACCESS_TOKEN_SECRET,
//       (err, payload) => {
//         if (err) {
//           const message =
//             err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
//           next();
//         } else {
//           // req.payload = payload;
//           res.redirect("/");
//         }
//       }
//     );
//   } else {
//     next();
//   }
// };
// export const createRefreshToken = async (userId) => {
//   return new Promise((resolve, reject) => {
//     const payload = {};
//     const secret = process.env.REFRESH_TOKEN_SECRET;
//     const options = {
//       expiresIn: "1y",
//       issuer: "dhruvmojila.com",
//       audience: userId.toString(),
//     };

//     jwt.sign(payload, secret, options, (err, token) => {
//       if (err) {
//         console.log(err.message);
//         reject(createHttpError.InternalServerError());
//         return;
//       }

//       resolve(token);
//     });
//   });
// };

// export const verifyRefreshTokenMiddleware = async (
//   refreshToken,
//   sessionSavedRefreceToken
// ) => {
//   return new Promise((resolve, reject) => {
//     jwt.verify(
//       refreshToken,
//       process.env.REFRESH_TOKEN_SECRET,
//       (err, payload) => {
//         if (err) {
//           console.log(err.message);
//           return reject(createHttpError.Unauthorized("Wrong refresh token"));
//         }
//         const userId = payload.aud;

//         // console.log(sessionSavedRefreceToken);

//         if (refreshToken === sessionSavedRefreceToken) {
//           resolve(userId);
//         } else {
//           return reject(createHttpError.Unauthorized("Token not valid!"));
//         }
//       }
//     );
//   });
// };

// export const validateUser = async (req, res, next) => {
//   const userAccessToken = req.cookies.accessToken;
//   if (userAccessToken) {
//     jwt.verify(
//       userAccessToken,
//       process.env.ACCESS_TOKEN_SECRET,
//       async (err, payload) => {
//         if (err) {
//           res.locals.user = null;
//           next();
//         } else {
//           // console.log(payload);
//           let user = await authDataFunctions.getUserById(payload.aud);
//           res.locals.user = user;
//           next();
//         }
//       }
//     );
//   } else {
//     res.locals.user = null;
//     next();
//   }
// };
