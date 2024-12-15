import { Router } from "express";
import {
  checkString,
  isContainsNumber,
  isValidEmail,
} from "../utils/helpers/helpers.js";
import { isValidPassword } from "../utils/helpers/bcryptHelper.js";
import { signInUser, signUpUser,
    getUserByEmail, setResetToken, validateResetToken, updatePassword
} from "../data/users.js";
import nodemailer from "nodemailer";
import { validationMethods } from "../utils/helpers/validations.js";
const router = Router();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "SurveySync100@gmail.com",
      pass: "ddcg crof hpjf ddev",
    },
  });

router
  .route("/register")
  .get(async (req, res) => {
    //code here for GET
    res.status(200).render("register", { title: "Register" });
  })
  .post(async (req, res) => {
    //code here for POST
    const userData = req.body;

    let errors = [];
    // console.log(userData);

    if (!userData || Object.keys(userData).length === 0) {
      errors.push("There are no fields in the request body");
    }

    try {
      userData.firstName = checkString(userData.firstName, "firstName");
      let hasNumber = isContainsNumber(userData.firstName);
      if (hasNumber) {
        throw "It is not allowed to have number in firstname!!";
      }
      if (userData.firstName.length < 2 || userData.firstName.length > 25) {
        throw "firstname should be at least 2 characters long with a max of 25 characters!!";
      }
    } catch (e) {
      errors.push(e);
    }

    try {
      userData.lastName = checkString(userData.lastName, "lastName");
      let hasNumber = isContainsNumber(userData.lastName);
      if (hasNumber) {
        throw "It is not allowed to have number in lastName!!";
      }
      if (userData.lastName.length < 2 || userData.lastName.length > 25) {
        throw "lastName should be at least 2 characters long with a max of 25 characters!!";
      }
    } catch (e) {
      errors.push(e);
    }

    try {
      userData.email = checkString(userData.email, "email");
      if (!isValidEmail(userData.email)) {
        throw "Invalid email!!";
      }
    } catch (e) {
      errors.push(e);
    }

    try {
      userData.userId = checkString(userData.userId, "userId");
      let hasNumber = isContainsNumber(userData.userId);
      if (hasNumber) {
        throw "It is not allowed to have number in userId!!";
      }
      if (userData.userId.length < 5 || userData.userId.length > 10) {
        throw "userId should be at least 5 characters long with a max of 10 characters!!";
      }
    } catch (e) {
      errors.push(e);
    }

    try {
      userData.password = checkString(userData.password, "password");
      userData.password = isValidPassword(userData.password);
    } catch (e) {
      errors.push(e);
    }

    try {
      userData.confirmPassword = checkString(
        userData.confirmPassword,
        "confirmPassword"
      );
      if (userData.password !== userData.confirmPassword) {
        throw "password and confirmPassword must match!";
      }
    } catch (e) {
      errors.push(e);
    }

    try {
      userData.role = checkString(userData.role, "role");
      userData.role = userData.role.toLowerCase();
      if (userData.role !== "admin" && userData.role !== "user") {
        throw `Only valid roles are admin and user! ${userData.role} can not be role!!`;
      }
    } catch (e) {
      errors.push(e);
    }

    if (errors.length > 0) {
      return res.status(400).render("register", {
        title: "Register",
        hasErrors: true,
        errors,
        userData,
      });
    }

    try {
      const response = await signUpUser(
        userData.firstName,
        userData.lastName,
        userData.userId,
        userData.password,
        userData.role,
        userData.email
      );

      if (response.registrationCompleted) {
        return res.redirect("/auth/login");
      } else {
        return res.status(400).render("register", {
          title: "Register",
          hasErrors: true,
          errors: response.errors,
          userData,
        });
      }
    } catch (e) {
      console.log(e);

      return res.status(500).render("error", {
        title: "Error",
        message: "Internal Server Error",
        link: "/register",
        linkName: "Register",
      });
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
    //code here for GET
    res.status(200).render("login", { title: "Login" });
  })
  .post(async (req, res) => {
    //code here for POST

    const userData = req.body;

    let errors = [];

    // console.log(userData);

    if (!userData || Object.keys(userData).length === 0) {
      errors.push("There are no fields in the request body");
    }

    try {
      userData.user_id = checkString(userData.user_id, "userId");
      let hasNumber = isContainsNumber(userData.user_id);
      if (hasNumber) {
        throw "It is not allowed to have number in userId!!";
      }
      if (userData.user_id.length < 5 || userData.user_id.length > 10) {
        throw "userId should be at least 5 characters long with a max of 10 characters!!";
      }
    } catch (e) {
      errors.push("Either the userId or password is invalid");
    }

    try {
      userData.password = checkString(userData.password, "password");
      userData.password = isValidPassword(userData.password);
    } catch (e) {
      errors.push("Either the userId or password is invalid");
    }

    if (errors.length > 0) {
      return res.status(400).render("login", {
        title: "Login",
        hasErrors: true,
        errors: [errors[0]],
        userData,
      });
    }

    try {
      const newUser = await signInUser(userData.user_id, userData.password);
      if (newUser?.hasError) {
        return res.status(400).render("login", {
          title: "Login",
          hasErrors: true,
          errors: newUser.errors,
          userData,
        });
      }

      if (newUser) {
        req.session.user = {
          _id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          userId: newUser.userId,
          role: newUser.role,
          email: newUser.email,
        };
        // if (newUser.role === "admin") {
        //   res.redirect("/admin");
        // } else if (newUser.role === "user") {
        //   res.redirect("/user");
        // }
        res.redirect("/dashboard");
      }
    } catch (e) {
      console.log(e);
      return res.status(500).render("error", {
        title: "Error",
        message: "Internal Server Error",
        link: "/login",
        linkName: "Login",
      });
    }
  });

router.route("/signoutuser").get(async (req, res) => {
  req.session.destroy();
  return res.status(200).render("signoutuser", { title: "Sign Out" });
});

router
    .route('/forgot-password')
    .get((req, res) => {
        res.render('forgotPassword', { title: 'Forgot Password' });
    })
    .post(async (req, res) => {     
        let email;
        try {
            email = validationMethods.isValidString(req.body.email, "User email");
            if (!isValidEmail(email)) {
                throw new Error("Invalid email");
            }
        } catch (error) {
            return res.status(403).render('error', {
                title: 'Error',
                message: error.message,
                link: '/dashboard',
                linkName: 'Dashboard',
            });
        }
        try {
            const user = await getUserByEmail(email);
            const { resetToken } = await setResetToken(user._id);
            const resetLink = `${req.protocol}://${req.get(
                "host"
            )}/auth/reset-password?token=${resetToken}&id=${user._id}`;
            await transporter.sendMail({
                from: "SurveySync100@gmail.com",
                to: user.email,
                subject: "Password Reset",
                text: `Reset your password using this link: ${resetLink}`,
            });
            res.json({ message: "Password reset email sent" });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    });


router
    .route('/reset-password')
    .get(async (req, res) => {
        let { token, id } = req.query;
        try {
            token = checkString(token, 'Request Token');
            id = checkString(id, 'Request Token');
            res.render('resetPassword', { title: 'Reset Password', token, id });
        } catch (error) {
            res.status(400).render('error', {
                title: 'Error',
                message: 'Invalid or expired reset link',
                link: '/auth/forgot-password',
                linkName: 'Request a new reset link',
            });
        }
    })
    .post(async (req, res) => {
        let { token, id, newPassword } = req.body;
        try {
            token = checkString(token, 'Request Token');
            id = checkString(id, 'Request Token')
            newPassword = checkString(newPassword, "New Password");
            newPassword = isValidPassword(newPassword);
            await validateResetToken(id, token);
            await updatePassword(id, newPassword);
            res.status(200).render("login", { title: "Login" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

export default router;
