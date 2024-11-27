import { Router } from "express";
import { verifyAccessTokenMiddleware } from "../utils/helpers/jwtHelper.js";

const router = Router();
router.get("/", verifyAccessTokenMiddleware, async (req, res) => {
  res.status(200).render("home", { title: "Home" });
});

export default router;
