import { Router } from "express";

const router = Router();
router.get("/", async (req, res) => {
  res.status(200).render("home", { title: "Home" });
});

export default router;
