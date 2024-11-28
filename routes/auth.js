import { Router } from "express";
import createHttpError from "http-errors";

import { authSchema } from "../utils/validations/auth.js";
import { authDataFunctions } from "../data/index.js";
import {
  createAccessToken,
  createRefreshToken,
  verifyAccessTokenForLoginRegister,
  verifyRefreshTokenMiddleware,
} from "../utils/helpers/jwtHelper.js";
const router = Router();

router.get(
  "/register",
  verifyAccessTokenForLoginRegister,
  async (req, res, next) => {
    res.status(200).render("register", { title: "Register" });
  }
);

router.post("/register", async (req, res, next) => {
  const userData = req.body;

  if (!userData || Object.keys(userData).length === 0) {
    return next(
      createHttpError.BadRequest("There are no fields in the request body")
    );
  }

  let validatedUserData;

  try {
    validatedUserData = await authSchema.validateAsync(userData);
  } catch (error) {
    return next(createHttpError.BadRequest(error.message));
  }

  try {
    const newUser = await authDataFunctions.registerUser(
      validatedUserData.email,
      validatedUserData.password
    );

    if (newUser) {
      const accessToken = await createAccessToken(newUser._id);
      const refreshToken = await createRefreshToken(newUser._id);
      res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 60000 });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 60000,
      });
      return res.status(201).send({ user: newUser._id });
    }
  } catch (e) {
    console.log(e);
    return next(createHttpError.InternalServerError(e));
  }
});

router.get(
  "/login",
  verifyAccessTokenForLoginRegister,
  async (req, res, next) => {
    res.status(200).render("login", { title: "Login" });
  }
);

router.post("/login", async (req, res, next) => {
  const userData = req.body;
  // console.log(userData);

  if (!userData || Object.keys(userData).length === 0) {
    return next(
      createHttpError.BadRequest("There are no fields in the request body")
    );
  }

  let validatedUserData;

  try {
    validatedUserData = await authSchema.validateAsync(userData);
  } catch (error) {
    return next(createHttpError.BadRequest(error.message));
  }

  try {
    const loginUser = await authDataFunctions.loginUser(
      validatedUserData.email,
      validatedUserData.password
    );

    if (loginUser) {
      const accessToken = await createAccessToken(loginUser._id);
      const refreshToken = await createRefreshToken(loginUser._id);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 60000,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 60000,
      });
      return res.status(201).send({ user: loginUser._id });
    }
  } catch (e) {
    console.log(e);
    return next(createHttpError.InternalServerError(e));
  }
});

router.post("/refresh-token", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw createHttpError.BadRequest("No token passed!!");
    }
    // console.log(req.session.refreshToken);
    const userId = await verifyRefreshTokenMiddleware(
      refreshToken,
      req.session.refreshToken
    );

    const accessToken = await createAccessToken(userId);
    const newRefreshToken = await createRefreshToken(userId);

    req.session.refreshToken = newRefreshToken;

    res.send({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    next(error);
  }
});

// router.delete("/logout", async (req, res, next) => {
//   try {
//     const { refreshToken } = req.body;
//     if (!refreshToken) {
//       throw createHttpError.BadRequest("Refresh token is not provided!");
//     }
//     const userId = await verifyRefreshTokenMiddleware(
//       refreshToken,
//       req.session.refreshToken
//     );

//     // console.log(refreshToken, "asdasd", req.session.refreshToken);

//     if (userId) {
//       req.session.destroy((err) => {
//         if (err) {
//           console.log(err.message);
//           throw createHttpError.InternalServerError();
//         }
//         console.log("Session destroyed and logged out!");
//         res.sendStatus(204);
//       });
//     } else {
//       throw createHttpError.BadRequest("Invalid toekn!!");
//     }
//   } catch (error) {
//     next(error);
//   }
// });
router.get("/logout", async (req, res, next) => {
  try {
    res.cookie("accessToken", "", { maxAge: 1 });
    res.cookie("refreshToken", "", { maxAge: 1 });
    res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
});

export default router;
