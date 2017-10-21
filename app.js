var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser =  require("body-parser");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");


var User = require("./models/user");


mongoose.connect("mongodb://user:user@ds117495.mlab.com:17495/authetest",{useMongoClient:true});


var app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));


//ADDING EXPRESS SESSION
app.use(require("express-session")({
    secret: "github is the best code hosting place",
    resave:false,
    saveUninitialized:false
  }));


app.use(passport.initialize());
app.use(passport.session());


passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

   
//=====ROUTES=====//

app.get("/",function(req,res){
res.render("home");
});

app.get("/secret",isLoggedIn,function(req,res){
    res.render("secret");
});



//=====AUTH ROUTES=====//

app.get("/register",function(req,res){ 
res.render("register");
});  

app.post("/register",function(req,res){
    req.body.username
    req.body.password
    User.register(new User({username:req.body.username}), req.body.password,function(err,user){
      if(err){
          console.log(err);
          return res.render('register');
      }
      passport.authenticate("local")(req,res,function(){
          res.redirect("/secret");
      });
    });
});


//=====LOGIN ROUTES=====//
app.get("/login",function(req,res){
  res.render("login");
});

app.post("/login",passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect: "/login"
}),function(req,res){

});


//=====LOGOUT=====//

app.get("/logout",function(req,res){
 req.logout();
 res.redirect("/");
});


//=====MIDDLEWARE=====//
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
}


app.listen(3000,function(){
    console.log("server started");
})
