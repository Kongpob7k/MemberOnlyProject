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
router.post("/login", (req,res,next)=>{
  passport.authenticate("local", (err,user,info)=>{
    if (err) return next(err); 
    if (!user) {
      return res.render("login",{ error: [info.message] });
    }
    req.logIn(user, err=>{
      if (err) return next(err);
      return res.redirect("/"); 
    });
  })(req,res,next); 
});


router.get("/logout",indexControllers.LogoutGet);
module.exports = router;