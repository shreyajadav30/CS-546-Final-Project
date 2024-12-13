//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/movies.js that you will call in your routes below
import { Router } from "express";
const router = Router();
import { usersDataFunctions } from "../data/index.js";

router.route("/").get(async (req, res) => {
  try {
    const users = await usersDataFunctions.getAllUsers();
    // console.log(users);
    const user = await usersDataFunctions.getUserById(req.session.user._id);
    res.render('userList', { users, user, searchTerm: '' })
    // res.render("userList", { users });
  } catch (error) {
    res.status(500).send("An error occurred while loading the page.");
  }
}).post(async (req, res) => {
  let {searchTerm} = req.body;
  if (!searchTerm || Object.keys(searchTerm).length === 0) {
    return res
      .status(400)
      .json({ error: "There are no fields in the request body" });
  }
  try {
      const users = await usersDataFunctions.searchUser(
        searchTerm
      );
      res.render("userList", { users, searchTerm });
      
  } catch (e) {
    return res.status(404).render("error");
  }
});;

router.route("/addUser").get(async (req, res) => {
  try {
    // console.log("......",req.session.user);
    const user = await usersDataFunctions.getUserById(req.session.user._id);
    res.render("addUser", {user});
  } catch (error) {
    res.status(500).send("An error occurred while loading the page.");
  }
});

router.route("/addUser/:id").get(async (req, res) => {
  try {
    const user = await usersDataFunctions.getUserById(req.params.id);
    // console.log("gggggg......", user);
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
  // console.log("jjjjjjjjjjj");
  if (!createUserData || Object.keys(createUserData).length === 0) {
    return res
      .status(400)
      .json({ error: "There are no fields in the request body" });
  }
  try {
    const { _id,firstName, lastName, email, userId, role } =
      createUserData;
      // console.log("iddd",_id);

      await usersDataFunctions.updateUser(
        _id,
        firstName,
        lastName,
        email,
        userId,
        role
      );
      res.redirect("/users/");
  } catch (e) {
    return res.status(404).render("error");
  }
});

router.route("/delete/:id").post(async (req, res) => {
  try {
    await usersDataFunctions.removeUser(req.params.id);

    res.redirect("/users/");
  } catch (e) {
    return res.status(404).render("error");
  }
});

export default router;
