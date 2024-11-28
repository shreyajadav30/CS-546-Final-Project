//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/movies.js that you will call in your routes below
import { Router } from "express";
const router = Router();
import { usersDataFunctions } from "../data/index.js";

router.route("/").get(async (req, res) => {
  try {
    const users = await usersDataFunctions.getAllUsers();
    // console.log(users);
    res.render("userList", { users });
  } catch (error) {
    res.status(500).send("An error occurred while loading the page.");
  }
});

router.route("/addUser").get(async (req, res) => {
  try {
    res.render("addUser");
  } catch (error) {
    res.status(500).send("An error occurred while loading the page.");
  }
});

router.route("/addUser/:id").get(async (req, res) => {
  try {
    const user = await usersDataFunctions.getUserById(req.params.id);
    console.log("gggggg......", user);
    res.render("addUser", { user });
  } catch (e) {
    return res.status(404).render("error", {
      errorClassName: "error",
      errorText: `No user found with that id!`,
    });
  }
});

router.route("/addUser").post(async (req, res) => {
  let createUserData = req.body;
  console.log("jjjjjjjjjjj");
  if (!createUserData || Object.keys(createUserData).length === 0) {
    return res
      .status(400)
      .json({ error: "There are no fields in the request body" });
  }
  try {
    const { firstName, lastName, email, password, username, role, survey } =
      createUserData;

    const { _id } = req.body;
    if (_id === "") {
      const newUser = await usersDataFunctions.AddUser(
        firstName,
        lastName,
        email,
        password,
        username,
        role,
        survey
      );
      // await newUser.save();
      res.redirect("/users/");
      console.log(">>>>>>>>>>>>>>>>>>");
      // res.send("Item saved to database");
      // res.render("addUser", { message: "User added successfully" });
    } else {
      console.log("oooooooooo");
      await usersDataFunctions.updateUser(
        _id,
        firstName,
        lastName,
        email,
        password,
        username,
        role,
        survey
      );
      // await updateUser.save();
      // res.send("Item saved to database");
      // res.render("addUser", { message: "User updated successfully" });
      res.redirect("/users/");
    }
  } catch (e) {
    return res.status(404).render("error");
  }
});

router.route("/delete/:id").post(async (req, res) => {
  try {
    await usersDataFunctions.removeUser(req.params.id);
    // res.render("addUser", { message: "User deleyed successfully" });

    res.redirect("/users/");
  } catch (e) {
    return res.status(404).render("error");
  }
});

export default router;
