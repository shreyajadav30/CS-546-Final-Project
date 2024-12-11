// document
//   .getElementById("registerForm")
//   .addEventListener("submit", async (event) => {
//     event.preventDefault();

//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;
//     const errorDom = document.querySelector(".error");

//     errorDom.textContent = "";

//     const data = { email, password };

//     try {
//       let res = await fetch("http://localhost:3000/auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });
//       let resData = await res.json();
//       //   console.log(resData.error.message);

//       if (resData.error) {
//         errorDom.textContent = resData.error.message;
//       }
//       if (resData.user) {
//         location.assign("/");
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   });

function checkString(strVal, varName) {
  if (!strVal) throw `Error: You must supply a ${varName}!`;
  if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  return strVal;
}

// Reference for password regex https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a/49359131

const isValidPassword = (password) => {
  let regexForPassword = /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9]).{8,}$/;

  if (password.length < 8) {
    throw `Error: Password must be 8 characters long!`;
  }

  if (!regexForPassword.test(password)) {
    throw `Error: Password must have one uppercase letter, number and  special character!`;
  }

  password.split("").map((char) => {
    if (char === " " || char === "") {
      throw `Error: Password must not contain any space!`;
    }
  });

  return password;
};

function isContainsNumber(str) {
  return str.split("").some((char) => !isNaN(parseInt(char)));
}

// Refrence hex code regex: https://stackoverflow.com/questions/8027423/how-to-check-if-a-string-is-a-valid-hex-color-representation

function isValidHex(str) {
  const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
  if (!hexColorRegex.test(str)) {
    throw "Invalid Hex Color Code!";
  }
  return str;
}

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function comparePasswordAndConfirmPassword() {
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const submitButton = document.getElementById("submitButton");

  if (password.value.trim() !== confirmPassword.value.trim()) {
    submitButton.disabled = true;
  } else {
    submitButton.disabled = false;
  }
}

const signUpForm = document.getElementById("signup-form");

if (signUpForm) {
  signUpForm.addEventListener("submit", (event) => {
    let errors = [];

    const firstName = document.getElementById("firstName");
    let firstNameVal = firstName.value.trim();

    const lastName = document.getElementById("lastName");
    let lastNameVal = lastName.value.trim();

    const userId = document.getElementById("userId");
    let userIdVal = userId.value.trim();

    const password = document.getElementById("password");
    let passwordVal = password.value.trim();

    const confirmPassword = document.getElementById("confirmPassword");
    let confirmPasswordVal = confirmPassword.value.trim();

    const email = document.getElementById("email");
    let emailVal = email.value.trim();

    const role = document.getElementById("role");
    let roleVal = role.value.trim();

    const submitButton = document.getElementById("submitButton");
    const errorDiv = document.getElementById("errorDiv");
    const errorDivUl = document.getElementById("errorDivUl");

    errorDiv.hidden = true;
    errorDivUl.innerHTML = "";

    try {
      firstNameVal = checkString(firstNameVal, "firstName");
      let hasNumber = isContainsNumber(firstNameVal);
      if (hasNumber) {
        throw "It is not allowed to have number in firstname!!";
      }
      if (firstNameVal.length < 2 || firstNameVal.length > 25) {
        throw "firstname should be at least 2 characters long with a max of 25 characters!!";
      }
    } catch (e) {
      errors.push(e);
    }

    try {
      lastNameVal = checkString(lastNameVal, "lastName");
      let hasNumber = isContainsNumber(lastNameVal);
      if (hasNumber) {
        throw "It is not allowed to have number in lastName!!";
      }
      if (lastNameVal.length < 2 || lastNameVal.length > 25) {
        throw "lastName should be at least 2 characters long with a max of 25 characters!!";
      }
    } catch (e) {
      errors.push(e);
    }

    try {
      userIdVal = checkString(userIdVal, "userId");
      let hasNumber = isContainsNumber(userIdVal);
      if (hasNumber) {
        throw "It is not allowed to have number in userId!!";
      }
      if (userIdVal.length < 5 || userIdVal.length > 10) {
        throw "userId should be at least 5 characters long with a max of 10 characters!!";
      }
    } catch (e) {
      errors.push(e);
    }

    try {
      passwordVal = checkString(passwordVal, "password");
      passwordVal = isValidPassword(passwordVal);
    } catch (e) {
      errors.push(e);
    }

    try {
      confirmPasswordVal = checkString(confirmPasswordVal, "confirmPassword");
      if (passwordVal !== confirmPasswordVal) {
        throw "password and confirmPassword must match!";
      }
    } catch (e) {
      errors.push(e);
    }

    try {
      emailVal = checkString(emailVal, "email");
      if (!isValidEmail(emailVal)) {
        throw "Invalid email!!";
      }
    } catch (e) {
      errors.push(e);
    }

    try {
      roleVal = checkString(roleVal, "role");
      roleVal = roleVal.toLowerCase();
      if (roleVal !== "admin" && roleVal !== "user") {
        throw `Only valid roles are admin and user! ${roleVal} can not be role!!`;
      }
    } catch (e) {
      errors.push(e);
    }

    if (errors.length > 0) {
      console.log("Form submission fired");
      event.preventDefault();
      console.log("Has a form");
      errorDiv.hidden = false;

      errors.map((err) => {
        let li = document.createElement("li");
        li.textContent = err;
        errorDivUl.appendChild(li);
      });
    } else {
      errorDiv.hidden = true;
      errorDivUl.innerHTML = "";
    }
  });
}
