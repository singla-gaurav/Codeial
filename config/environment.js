const fs = require("fs");
const rfs = require("rotating-file-stream");
const path = require("path");


const development = {
    name: "development",
    asset_path: "./assets",
    session_cookie_key: "tobechanged",
    db: "codeial-development",
    google_client_id: "Paste your client id here",
    google_client_secret: "Paste your client Secret here",
    google_callback_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: "codeial"
}


module.exports=development
// module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);