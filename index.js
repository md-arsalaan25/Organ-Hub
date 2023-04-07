const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();



app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));


mongoose.set("strictQuery",false);
mongoose.connect("mongodb+srv://indros0603:chIDkDUjLGg7HLHY@cluster0.ntmh4fz.mongodb.net/OrganHubDB",{ useNewUrlParser: true });

const HospitalSchema = {
    hospitalName: String,
    state: String,
    city: String,
    offName: String,
    contactNo:String,
    email:String,
    password:String
}

const Hospital = mongoose.model("Hospital", HospitalSchema); 

app.get("/", function(req, res) {
    res.render("home");
});

//    HOSPITAL
app.get("/loginHospital", function(req, res) {
    if(req.session.hospital){
        res.render("hospitalHome");
    }else{
        res.render("loginHospital");
    }
});

app.get("/signUpHospital", function(req, res) {
    res.render("SignUpHospital");
});

app.post("/SignUpHospital", function(req, res) {
    const newUser = new Hospital({
        hospitalName: req.body.hospName,
        state: req.body.stt,
        city: req.body.city,
        offName: req.body.title+ req.body.fName,
        contactNo:req.body.contactNo,
        email:req.body.email,
        password:req.body.password
    });

    newUser.save().then(()=>{
        res.render("secrets");
        console.log("New Hospital " + req.body.hospName + " account has been registered");
    }).catch((err)=>{
        console.log(err);
    })
});

app.post("/loginHospital", function(req, res){
    const email = req.body.email;
    const password = req.body.password;

    Hospital.findOne({email: email}).then((foundUser)=>{
        if(foundUser.password === password){
            // res.render("secrets");
            req.session.hospital= foundUser;
            req.session.save();
            console.log("User " + email + " has been successfully logged in");
            res.redirect("/hospitalHome");
        }
        else{
            console.log("Incorrect password or username");
        }
    }).catch((err)=>{
        console.log(err);
    })

});

app.listen(3000, function() {
    console.log("Server starting on port 3000");
});

