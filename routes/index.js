import authRoutes from "./auth.js";
import homeRoutes from "./home.js";
import surveyRoutes from "./survey.js";
import { static as staticDir } from "express";

import usersRoutes from "./users.js";
import {
  isAdmin,
  isUserLoggedInForLoginAndSignUp,
} from "../utils/middlewares/authMiddlewares.js";

const constructorMethod = (app) => {
  app.use("/public", staticDir("public"));

  app.use("/", isUserLoggedIn, homeRoutes);
  app.use("/auth", isUserLoggedInForLoginAndSignUp, authRoutes);
  app.use("/survey", isUserLoggedIn, surveyRoutes);
  app.use("/users", isUserLoggedIn, usersRoutes);

  app.use("*", (req, res, next) => {
    return res.status(404).render("error", {
      title: "Not Found",
      message: "404: Not Found",
      link: "/",
      linkName: "Home",
    });
  });
};

export default constructorMethod;
