function checkString(strVal, varName) {
  if (!strVal) throw `Error: You must supply a ${varName}!`;
  if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  return strVal;
}

function isContainsNumber(str) {
  return str.split("").some((char) => !isNaN(parseInt(char)));
}

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

const userList = document.getElementById("userList");
const addUser = document.getElementById("addUser");
const userProfile = document.getElementById("userProfile");
const updateUser = document.getElementById("updateUser");

if (userList) {
  userList.addEventListener("submit", (event) => {
    event.preventDefault()
console.log('......,,,,,......');
    let errors = [];

    const firstName = document.getElementById("firstName");
    let firstNameVal = firstName.value.trim();

    const lastName = document.getElementById("lastName");
    let lastNameVal = lastName.value.trim();

    const userId = document.getElementById("userId");
    let userIdVal = userId.value.trim();

    const email = document.getElementById("email");
    let emailVal = email.value.trim();

    const role = document.getElementById("role");
    let roleVal = role.value.trim();

    //   const editButton = document.getElementById("editButton");
    //   const deleteButton = document.getElementById("deleteButton");
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
        console.log('jjjjj');
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
if (addUser) {
    addUser.addEventListener("submit", (event) => {
      let errors = [];
  
      const firstName = document.getElementById("firstName");
      let firstNameVal = firstName.value.trim();
  
      const lastName = document.getElementById("lastName");
      let lastNameVal = lastName.value.trim();
  
      const userId = document.getElementById("userId");
      let userIdVal = userId.value.trim();
  
      const email = document.getElementById("email");
      let emailVal = email.value.trim();
  
      const role = document.getElementById("role");
      let roleVal = role.value.trim();
  
      //   const editButton = document.getElementById("editButton");
      //   const deleteButton = document.getElementById("deleteButton");
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
if (userProfile) {
    userProfile.addEventListener("submit", (event) => {
      let errors = [];
  
      const firstName = document.getElementById("firstName");
      let firstNameVal = firstName.value.trim();
  
      const lastName = document.getElementById("lastName");
      let lastNameVal = lastName.value.trim();
  
      const userId = document.getElementById("userId");
      let userIdVal = userId.value.trim();
  
      const email = document.getElementById("email");
      let emailVal = email.value.trim();
  
      const role = document.getElementById("role");
      let roleVal = role.value.trim();
  
      //   const editButton = document.getElementById("editButton");
      //   const deleteButton = document.getElementById("deleteButton");
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
if (updateUser) {
    updateUser.addEventListener("submit", (event) => {
      let errors = [];
  
      const firstName = document.getElementById("firstName");
      let firstNameVal = firstName.value.trim();
  
      const lastName = document.getElementById("lastName");
      let lastNameVal = lastName.value.trim();
  
      const userId = document.getElementById("userId");
      let userIdVal = userId.value.trim();
  
      const email = document.getElementById("email");
      let emailVal = email.value.trim();
  
      const role = document.getElementById("role");
      let roleVal = role.value.trim();
  
      //   const editButton = document.getElementById("editButton");
      //   const deleteButton = document.getElementById("deleteButton");
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
