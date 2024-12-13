export const routeLog = async (req, res, next) => {
  console.log(
    `[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (${
      req.session.user
        ? `Authenticated ${req.session.user.role}`
        : "Non-Authenticated"
    })`
  );
  next();
};

export const roleBasedRouting = async (req, res, next) => {
  if (req.path === "/") {
    //     console.log("root");
    if (req.session.user) {
      let role = req.session.user.role;
      // if (role === "admin") {
      //   return res.redirect("/admin");
      // } else if (role === "user") {
      //   return res.redirect("/user");
      // }
      return res.redirect("/dashboard");
    } else {
      return res.redirect("/auth/login");
    }
  } else {
    next();
  }
};

export const isUserLoggedInForLoginAndSignUp = async (req, res, next) => {
  //   if (req.path === "/") {
  // console.log("signinuser", req.path);
  if (req.path === "/signoutuser") {
    next();
  } else {
    if (req.session.user) {
      let role = req.session.user.role;
      // if (role === "admin") {
      //   return res.redirect("/admin");
      // } else if (role === "user") {
      //   return res.redirect("/user");
      // }
      return res.redirect("/dashboard");
    } else {
      next();
    }
  }
  //   } else {
  //     next();
  //   }
};

export const signOutUserMiddleWare = async (req, res, next) => {
  if (req.path === "/") {
    if (req.session.user) {
      next();
    } else {
      return res.redirect("/auth/login");
    }
  } else {
    next();
  }
};

export const isAdmin = async (req, res, next) => {
  //     console.log("administrator");
  if (req.session.user) {
    let role = req.session.user.role;
    if (role === "admin") {
      next();
    } else if (role === "user") {
      return res.status(403).render("error", {
        title: "Error",
        message: "403: User does not have permission to view the page.",
        link: "/",
        linkName: "Home",
      });
    }
  } else {
    return res.redirect("/auth/login");
  }
};

export const isUser = async (req, res, next) => {
  //     console.log("user");
  if (req.session.user) {
    next();
  } else {
    return res.redirect("/auth/login");
  }
};

export const isUserLoggedIn = async (req, res, next) => {
  //   if (req.path === "/") {
  //     console.log("signinuser");
  if (req.session.user) {
    next();
  } else {
    return res.redirect("/auth/login");
  }
  //   } else {
  //     next();
  //   }
};
