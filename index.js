const express = require("express");
const cookieParser = require("cookie-parser");
const env = require("./config/environment");

const app = express();
require("./config/view-helpers")(app);
const port = 8000;
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");
const db=require("./config/mongoose")

// used for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");

const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const customMware = require("./config/middleware");

const path = require("path");

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, env.asset_path)));



app.use(cookieParser());
app.use(expressLayouts);

// extract styles and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);


// setting up view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Mongo Store is used to store session cookie in the db
app.use(session({
    name: "codeial",
    // TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000*60*100)
    },
    store: new MongoStore({
        mongooseConnection: db
        // autoRemove: "enabled"
    },
    function(err){
        console.log(err || "connect-mongodb setup ok");
    }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash)

// use express routers
app.use("/", require("./routes"));

app.listen(port, function(err){
    if (err){
        console.log(err);
        return;
    }
    console.log("Server is up and running on port:",port);
})