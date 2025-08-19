const express = require("express");
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const path = require("node:path");
const app = express();
const indexRouter = require("./routes/indexRouter");
const {pool} = require("./config/db");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const userModel = require("./models/userModel");
const { initializeDatabase } = require("./models/initializeDatabase");
const bcrypt = require("bcryptjs");
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(express.json())
app.use(express.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname, 'public')));

initializeDatabase();

app.use(session({
    store : new pgSession({
        pool : pool,
        tableName : "session"
    }),
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : false,
    cookie: { maxAge: 1000 * 60 * 60 }
}))

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await userModel.findUserByUsername(username);
    if (!user) return done(null, false, { message: 'Incorrect username.' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return done(null, false, { message: 'Incorrect password.' });
    return done(null, user);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  done(null, result.rows[0]);
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/",indexRouter);

app.listen(3000,()=>{
    console.log("Server Running at Port",3000);
})