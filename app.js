const express                 =require("express"),
        app                   =express(),
        bodyParser            =require("body-parser"),
        mongoose              =require("mongoose"),
        User                  =require("./models/user"),
        LocalStrategy         =require("passport-local"),
        passport              =require("passport"),
        passportLocalMongoose =require("passport-local-mongoose");



mongoose.connect("mongodb://localhost/auth_demo");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");


app.use(require("express-session")({
    secret: "Bu bir session express uygulamasidir.",
    resave:false,
    saveUninitialized:false

}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Routes

app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/kaydol", (req, res)=>{
    res.render("kaydol");
});


//Kaydol Routes
//Kayıt Formunu getir
app.post("/kaydol", (req, res)=>{
    User.register(new User({username: req.body.username}), req.body.password, (err, user)=>{
        if(err){
            console.log(err);
            return res.render("home");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/gizli");
        });
    });
});

//Giris Routes
//Giriş formunu getir
app.get("/giris", (req, res)=>{
    res.render("giris");
});

//giris isteği gönder
app.post("/giris", passport.authenticate("local", {
    successRedirect:"/gizli",
    failureRedirect:"/giris"
}), (req, res)=>{
   
});

//Çikis Routes
app.get("/cikis", (req, res)=>{
    req.logOut();
    res.redirect("/");
});

function isLoggedIn(req,res,next){
    if (req.isAuthenticated()){
        return next();
    } res.redirect("giris");
}




//Gizli Route
app.get("/gizli", isLoggedIn , (req, res)=>{
    res.render("gizli");
});




    
//------------------------------------------
var server = app.listen(3000, ()=>{
    console.log("Sunucu Portu : %d ", server.address().port);
})