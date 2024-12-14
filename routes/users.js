//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/movies.js that you will call in your routes below
import { Router } from "express";
const router = Router();
import { users } from "../config/mongoCollections.js";
// import { validateInputsTeams, validateInputsId } from "../helpers.js";
import { ObjectId } from "mongodb";
import { usersDataFunctions } from "../data/index.js";
import {
  checkString,
  isContainsNumber,
  isValidEmail,
} from "../utils/helpers/helpers.js";

router
  .route("/")
  .get(async (req, res) => {
    try {
      const users = await usersDataFunctions.getAllUsers();
      // console.log(users);
      const user = await usersDataFunctions.getUserById(req.session.user._id);
      res.status(200).render("userList", { title: "userList" ,users, user, searchTerm: "" });
      // res.render("userList", { users });
    } catch (error) {
      return res.status(500).render("error", {
        title: "Error",
        message: "Internal Server Error",
        link: "/dasboard",
        linkName: "Dasboard",
      })
    }
  })
  .post(async (req, res) => {
    let { searchTerm } = req.body;
    let errors = [];
    if (!searchTerm || Object.keys(searchTerm).length === 0) {
      errors.push("There are no fields in the request body");
    }
    try {
      searchTerm = checkString(searchTerm, "searchTerm");
    } catch (e) {
      errors.push(e);
    }

    if (errors.length > 0) {
      return res.status(400).render("userList", {
        title: "userList",
        hasErrors: true,
        errors,
        searchTerm,
      });
    }
    try {
      const users = await usersDataFunctions.searchUser(searchTerm);
      // res.render("userList", { users, searchTerm });
      if (!users.hasError) {
        res.render("userList", { users, searchTerm });
      } else {
        return res.status(400).render("userList", {
          title: "userList",
          hasErrors: true,
          errors: users.errors,
          searchTerm,
        });
      }
    } catch (e) {
      // console.log('eeeee',e);
      if(e==="No user with that name found."){
        return res.status(400).render("userList", {
          title: "userList",
          hasErrors: true,
          errors: [e],
          searchTerm,
        });
      }
      // return res.status(404).render("error");
      return res.status(500).render("error", {
        title: "Error",
        message: "Internal Server Error",
        link: "/dasboard",
        linkName: "Dasboard",
      });
    }
  });

router.route("/addUser").get(async (req, res) => {
  try {
    // console.log("......",req.session.user);
    const user = await usersDataFunctions.getUserById(req.session.user._id);
    res.status(200).render("addUser", { user });
  } catch (error) {
    return res.status(500).render("error", {
      title: "Error",
      message: "Internal Server Error",
      link: "/dasboard",
      linkName: "Dasboard",
    })
  }
});

router.route("/addUser/:id").get(async (req, res) => {
  try {
    const user = await usersDataFunctions.getUserById(req.params.id);
    // console.log("gggggg......", user);
    res.render("addUser", { user });
  } catch (e) {
    return res.status(500).render("error", {
      title: "Error",
      message: "Internal Server Error",
      link: "/dasboard",
      linkName: "Dasboard",
    })
  }
});

router.route("/addUser").post(async (req, res) => {
  let createUserData = req.body;
  const usersCollection = await users();
  // console.log("jjjjjjjjjjj");
  let errors = [];

  if (!createUserData || Object.keys(createUserData).length === 0) {
    errors.push("There are no fields in the request body");
  }
  try {
    createUserData.firstName = checkString(
      createUserData.firstName,
      "firstName"
    );
    let hasNumber = isContainsNumber(createUserData.firstName);
    if (hasNumber) {
      throw "It is not allowed to have number in firstname!!";
    }
    if (
      createUserData.firstName.length < 2 ||
      createUserData.firstName.length > 25
    ) {
      throw "firstname should be at least 2 characters long with a max of 25 characters!!";
    }
  } catch (e) {
    errors.push(e);
  }

  try {
    createUserData.lastName = checkString(createUserData.lastName, "lastName");
    let hasNumber = isContainsNumber(createUserData.lastName);
    if (hasNumber) {
      throw "It is not allowed to have number in lastName!!";
    }
    if (
      createUserData.lastName.length < 2 ||
      createUserData.lastName.length > 25
    ) {
      throw "lastName should be at least 2 characters long with a max of 25 characters!!";
    }
  } catch (e) {
    errors.push(e);
  }

  try {
    createUserData.email = checkString(createUserData.email, "email");
    if (!isValidEmail(createUserData.email)) {
      throw "Invalid email!!";
    }
    if(req.session.user.email !== createUserData.email){
      const user = await usersCollection.findOne({
        email: { $regex: new RegExp(createUserData.email, "i") },
      });
  
      if (user) {
        throw "email already exist!";
      }}
  } catch (e) {
    errors.push(e);
  }

  try {
    createUserData.userId = checkString(createUserData.userId, "userId");
    let hasNumber = isContainsNumber(createUserData.userId);
    if (hasNumber) {
      throw "It is not allowed to have number in userId!!";
    }
    if (createUserData.userId.length < 5 || createUserData.userId.length > 10) {
      throw "userId should be at least 5 characters long with a max of 10 characters!!";
    }
    if(req.session.user.userId !== createUserData.userId){
      const user = await usersCollection.findOne({
        userId: { $regex: new RegExp(`${createUserData.userId}`, "i") },
      });
  
      if (user) {
        throw "UserId already exist!";
      }}
  } catch (e) {
    errors.push(e);
  }
  try {
    createUserData.role = checkString(createUserData.role, "role");
    createUserData.role = createUserData.role.toLowerCase();
    if (createUserData.role !== "admin" && createUserData.role !== "user") {
      throw `Only valid roles are admin and user! ${createUserData.role} can not be role!!`;
    }
  } catch (e) {
    errors.push(e);
  }

  if (errors.length > 0) {
    return res.status(400).render("userList", {
      title: "userList",
      hasErrors: true,
      errors,
      user: createUserData,
    });
  }
  try {
    const { _id, firstName, lastName, email, userId, role } = createUserData;
    // console.log("iddd",_id);

    let updateusr = await usersDataFunctions.updateUser(
      _id,
      firstName,
      lastName,
      email,
      userId,
      role
    );
    // res.redirect("/users/");
    // console.log("...", updateusr);
    if (!updateusr.hasErrors) {
      return res.redirect("/users/");
    } else {
      return res.status(400).render("userList", {
        title: "userList",
        hasErrors: true,
        errors: updateusr.errors,
        user: createUserData,
      });
    }
  } catch (e) {
    // console.log(e);
    // return res.status(404).render("error");
    return res.status(500).render("error", {
      title: "Error",
      message: "Internal Server Error",
      link: "/dasboard",
      linkName: "Dasboard",
    });
  }
});

router.route("/delete/:id").post(async (req, res) => {
  try {
    await usersDataFunctions.removeUser(req.params.id);

    res.redirect("/users/");
  } catch (e) {
    return res.status(500).render("error", {
      title: "Error",
      message: "Internal Server Error",
      link: "/dasboard",
      linkName: "Dasboard",
    })
  }
});

router.route("/getAllUsers").get(async (req, res) => {
  try {
    const users = await usersDataFunctions.getAllUsers();
    // console.log(users);
    res.status(200).json(users);
  } catch (error) {
    return res.status(500).render("error", {
      title: "Error",
      message: "Internal Server Error",
      link: "/dasboard",
      linkName: "Dasboard",
    })
  }
});

router.route("/userProfile").get(async (req, res) => {
  try {
    const users = await usersDataFunctions.getAllUsers();
    // console.log(users);
    const user = await usersDataFunctions.getUserById(req.session.user._id);
    res.render("userProfile", { title:"Profile", users, user, searchTerm: "" });
    // res.render("userList", { users });
  } catch (error) {
    return res.status(500).render("error", {
      title: "Error",
      message: "Internal Server Error",
      link: "/dasboard",
      linkName: "Dasboard",
    })
  }
});

router.route("/userProfile/:id").get(async (req, res) => {
  try {
    const user = await usersDataFunctions.getUserById(req.params.id);
    // console.log("gggggg......", user);
    res.render("updateUser", { user });
  } catch (e) {
    return res.status(500).render("error", {
      title: "Error",
      message: "Internal Server Error",
      link: "/dasboard",
      linkName: "Dasboard",
    })
  }
});
router.route("/userProfile").post(async (req, res) => {
  let createUserData = req.body;
  const usersCollection = await users();
  // console.log("jjjjjjjjjjj");
  let errors = [];

  if (!createUserData || Object.keys(createUserData).length === 0) {
    errors.push("There are no fields in the request body");
  }
  try {
    createUserData.firstName = checkString(
      createUserData.firstName,
      "firstName"
    );
    let hasNumber = isContainsNumber(createUserData.firstName);
    if (hasNumber) {
      throw "It is not allowed to have number in firstname!!";
    }
    if (
      createUserData.firstName.length < 2 ||
      createUserData.firstName.length > 25
    ) {
      throw "firstname should be at least 2 characters long with a max of 25 characters!!";
    }
  } catch (e) {
    errors.push(e);
  }

  try {
    createUserData.lastName = checkString(createUserData.lastName, "lastName");
    let hasNumber = isContainsNumber(createUserData.lastName);
    if (hasNumber) {
      throw "It is not allowed to have number in lastName!!";
    }
    if (
      createUserData.lastName.length < 2 ||
      createUserData.lastName.length > 25
    ) {
      throw "lastName should be at least 2 characters long with a max of 25 characters!!";
    }
  } catch (e) {
    errors.push(e);
  }

  try {
    createUserData.email = checkString(createUserData.email, "email");
    if (!isValidEmail(createUserData.email)) {
      throw "Invalid email!!";
    }
    if(req.session.user.email != createUserData.email){
      const user = await usersCollection.findOne({
        email: { $regex: new RegExp(createUserData.email, "i") },
      });
  
      if (user) {
        throw "email already exist!";
      }}
  } catch (e) {
    errors.push(e);
  }

  try {
    createUserData.userId = checkString(createUserData.userId, "userId");
    let hasNumber = isContainsNumber(createUserData.userId);
    if (hasNumber) {
      throw "It is not allowed to have number in userId!!";
    }
    if (createUserData.userId.length < 5 || createUserData.userId.length > 10) {
      throw "userId should be at least 5 characters long with a max of 10 characters!!";
    }
    // mongo check case insensitvely : ref: https://stackoverflow.com/questions/8246019/case-insensitive-search-in-mongo
    if(req.session.user.userId !== createUserData.userId){
      const user = await usersCollection.findOne({
        userId: { $regex: new RegExp(`${createUserData.userId}`, "i") },
      });
  
      if (user) {
        throw "UserId already exist!";
      }}
  } catch (e) {
    errors.push(e);
  }
  try {
    createUserData.role = checkString(createUserData.role, "role");
    createUserData.role = createUserData.role.toLowerCase();
    if (createUserData.role !== "admin" && createUserData.role !== "user") {
      throw `Only valid roles are admin and user! ${createUserData.role} can not be role!!`;
    }
  } catch (e) {
    errors.push(e);
  }

  if (errors.length > 0) {
    return res.status(400).render("userProfile", {
      title: "userProfile",
      hasErrors: true,
      errors,
      user: createUserData,
    });
  }
  try {
    const { _id, firstName, lastName, email, userId, role } = createUserData;
    // console.log("iddd", createUserData);

    let updateusr = await usersDataFunctions.updateUser(
      _id,
      firstName,
      lastName,
      email,
      userId,
      role
    );
    // res.redirect("/users/userProfile/");
    if (!updateusr.hasError) {
      // console.log('....', updateusr);
      return res.redirect("/users/userProfile/");
    } else {
      return res.status(400).render("userProfile", {
        title: "Profile",
        hasErrors: true,
        errors: updateusr.errors,
        user: createUserData,
      });
    }
  } catch (e) {
    // console.log("?????", e);
    // return res.status(404).render("error");
    return res.status(500).render("error", {
      title: "Error",
      message: "Internal Server Error",
      link: "/dasboard",
      linkName: "Dasboard",
    });
  }
});

export default router;
