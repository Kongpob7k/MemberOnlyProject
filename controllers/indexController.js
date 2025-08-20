const {body,validationResult} = require("express-validator");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");

exports.IndexGet = async(req,res)=>{
    console.log(req.session);
    const cur = req.session.passport;
    const userPost = await userModel.callPost();
    let isadmin=0;
    if(cur){
        isadmin = await userModel.isadmin(cur.user);
    }
    res.render("index",{ cur , error:null,userPost,isadmin});
}

exports.IndexPost = async(req,res)=>{
    const cur = req.session.passport;
    if(req.body.secret.toUpperCase() !== "MOODENG"){
        const userPost = await userModel.callPost();
        let isadmin=0;
        if(cur){
            isadmin = await userModel.isadmin(cur.user);
        }
        res.render("index",{ cur , error:"not correct",userPost,isadmin});
    }
    else {
        await userModel.setAdmin(cur.user);
        res.redirect("/");
    }
}

exports.FormGet = (req,res)=>{
    res.render("form");
}

exports.FormPost = async(req,res)=>{
    const currentUser = req.session.passport.user;
    const user = await userModel.findUserById(currentUser);
    await userModel.createForm(req.body.title,req.body.content,user.username);
    res.redirect("/");
}

exports.SignupGet = (req,res)=>{
    res.render("sign-up");
}

const validateUser = [
    body("username")
        .trim()
        .notEmpty().withMessage("Please input username")
        .custom(async (value) => {
            const user = await userModel.findUserByUsername(value);
            if (user) {
                throw new Error("This Username has been used");
            }
            return true;
        }),
    body("password")
        .trim()
        .notEmpty().withMessage("Please input password")
        .isLength({min:8}).withMessage("Password must be at least 8 length"),
    body("confirmPassword")
        .trim()
        .notEmpty().withMessage("Please confirm your password")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Confirm password does not match password");
            }
            return true;
        })    
];

exports.SignupPost = [
    validateUser,
    async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).render("sign-up",{
                errors : errors.array(),
            });
        }
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        await pool.query("INSERT INTO users (username, password,admin) VALUES ($1, $2, $3)", [req.body.username, hashedPassword, 0]);
        res.redirect("/");
    }
]

exports.LoginGet = (req, res) => {
    const error = req.session.error || [];
    req.session.error = [];
    res.render("login", { error });
};

exports.LoginPost = (req,res)=>{
    res.redirect("/");
}

exports.LogoutGet = (req,res)=>{
    req.logout(() => {
        res.redirect('/');
    });
}