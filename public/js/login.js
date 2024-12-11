// document
//   .getElementById("loginForm")
//   .addEventListener("submit", async (event) => {
//     event.preventDefault();

//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;
//     const errorDom = document.querySelector(".error");

//     errorDom.textContent = "";

//     const data = { email, password };

//     try {
//       let res = await fetch("http://localhost:3000/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });
//       let resData = await res.json();
//       // console.log(resData);

//       if (resData.error) {
//         errorDom.textContent = resData.error.message;
//       }
//       if (resData.user) {
//         location.replace("/");
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

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

const signInForm = document.getElementById("signin-form");

if (signInForm) {
  signInForm.addEventListener("submit", (event) => {
    let errors = [];
    const userId = document.getElementById("user_id");
    let userIdVal = userId.value.trim();

    const password = document.getElementById("password");
    let passwordVal = password.value.trim();
    const errorDiv = document.getElementById("errorDiv");
    const errorDivUl = document.getElementById("errorDivUl");

    errorDiv.hidden = true;
    errorDivUl.innerHTML = "";

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
      errors.push("Either the userId or password is invalid");
    }

    try {
      passwordVal = checkString(passwordVal, "password");
      passwordVal = isValidPassword(passwordVal);
    } catch (e) {
      errors.push("Either the userId or password is invalid");
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
