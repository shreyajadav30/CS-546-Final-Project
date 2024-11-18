import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

import configRoutesFunction from "./routes/index.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configRoutesFunction(app);

app.listen(PORT, () => {
  console.log(`Listning on http://localhost:${PORT}`);
});
