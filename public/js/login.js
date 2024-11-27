document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorDom = document.querySelector(".error");

    errorDom.textContent = "";

    const data = { email, password };

    try {
      let res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      let resData = await res.json();
      // console.log(resData);

      if (resData.error) {
        errorDom.textContent = resData.error.message;
      }
      if (resData.user) {
        location.assign("/");
      }
    } catch (e) {
      console.log(e);
    }
  });
