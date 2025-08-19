const { Router } = require("express");
const passport = require('passport');
const router = Router();
const indexControllers = require("../controllers/indexController");

router.get("/", indexControllers.IndexGet);
router.post("/",indexControllers.IndexPost);

router.get("/form",(req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }
    else{
        res.redirect("/");
    }
},indexControllers.FormGet);
router.post("/form",indexControllers.FormPost);

router.get("/sign-up", indexControllers.SignupGet);
router.post("/sign-up", indexControllers.SignupPost);

router.get("/login",indexControllers.LoginGet);
router.post("/login",passport.authenticate('local', { successRedirect: '/',failureRedirect: '/login' ,failureMessage: true}),indexControllers.LoginPost);

router.get("/logout",indexControllers.LogoutGet);
module.exports = router;