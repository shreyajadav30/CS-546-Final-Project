import crypto from "crypto";

const ACCESS_TOKEN_SECRET = crypto.randomBytes(32).toString("hex");
const REFRESH_TOKEN_SECRET = crypto.randomBytes(32).toString("hex");
const EXPRESS_SESSION_SECRET = crypto.randomBytes(32).toString("hex");
console.log("ACCESS_TOKEN_SECRET", ACCESS_TOKEN_SECRET);
console.log("REFRESH_TOKEN_SECRET", REFRESH_TOKEN_SECRET);
console.log("EXPRESS_SESSION_SECRET", EXPRESS_SESSION_SECRET);
