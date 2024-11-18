import { Router } from "express";
import createHttpError from "http-errors";

import { users } from "../config/mongoCollections.js";
import { authSchema } from "../utils/validations/auth.js";
import { authDataFunctions } from "../data/index.js";
const router = Router();

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
    // return res.send({ accessToken, refreshToken });
    return res.send({ xyz: 1 });
  } catch (e) {
    return next(createHttpError.InternalServerError(e));
  }
});

router.post("/login", async (req, res) => {
  res.send("login route");
});
router.post("/refresh-token", async (req, res) => {
  res.send("refresh-token route");
});
router.delete("/logout", async (req, res) => {
  res.send("logout route");
});

export default router;
