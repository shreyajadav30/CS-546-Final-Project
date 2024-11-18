import createHttpError from "http-errors";
import authRoutes from "./auth.js";

const constructorMethod = (app) => {
  app.use("/auth", authRoutes);

  app.use("*", (req, res, next) => {
    // return res.status(404).json({ error: "Not found" });
    return next(createHttpError.NotFound());
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    });
  });
};

export default constructorMethod;
