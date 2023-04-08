const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();




app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: "secret"
}));

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
    contactNo:String,
    email:String,
    password:String,
    town:String,
    Address:String,
    PinCode: String,
    Website: String,
    HospitalLogo: String,
    offName: String,
    Specialization: String,
    AddressOfficer: String,
    emailOfficer:String
}

const DonorSchema = {
    donorName: String,
    state: String,
    city: String,
    contactNo:String,
    email: String,
    password: String,
    age: Number
}

const Hospital = mongoose.model("Hospital", HospitalSchema);
const Donor = mongoose.model("Donor",DonorSchema); 

app.get("/", function(req, res) {
    res.render("home");
});

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

app.get("/hospitalHome", function(req, res) {
    if(req.session.hospital){
        console.log(req.session.hospital);
        res.render("hospitalHome");
    }
    else{
        res.redirect("/loginHospital");
    }
    
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

app.get("/logout",function(req,res){
    req.session.destroy();
    res.redirect("/")
});

app.get("/signUp",function(req,res){
    res.render("signUp");
});


app.get("/profileDonor",function(req,res){
    res.render("profileDonor");
});

app.get("/loginDonor", function(req, res) {
    if(req.session.hospital){
        res.render("DonorHome");
    }else{
        res.render("donorLogin.ejs");
    }
});

app.get("/signUpDonor", function(req, res) {
    res.render("signUpDonor");
});

app.post("/signUpDonor", function(req, res) {
    const newUser = new Donor({
        donorName: req.body.title + req.body.donorName,
        state:  req.body.stt,
        city:  req.body.city,
        contactNo: req.body.contact,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age
    });

    newUser.save().then(()=>{
        res.render("loginHospital");
        console.log("New Donor " + req.body.donorName + " account has been registered");
    }).catch((err)=>{
        console.log(err);
    })
});

app.post("/loginDonor", function(req, res){
    const email = req.body.email;
    const password = req.body.password;

    Donor.findOne({email: email}).then((foundUser)=>{
        if(foundUser.password === password){
            // res.render("secrets");
            req.session.donor= foundUser;
            req.session.save();
            console.log("User " + email + " has been successfully logged in");
            res.redirect("/donorHome");
        }
        else{
            console.log("Incorrect password or username");
        }
    }).catch((err)=>{
        console.log(err);
    })


});

app.get("/profileHospital",function(req,res){
    res.render("profileHospital");
})

app.get("/request",function(req,res){
    res.render('hospitalRequest');

});

app.get("/address",function(req,res){
    res.render("hospitalAddress");
});

app.get("/database",function(req,res){
    res.render("hospitalDatabase");
});

app.get("/show",function(req,res){

    const email= req.session.hospital.email;
    Organs.find({},function(err,foundOrgans){
        if(!err){
            if(foundOrgans){
                res.render("organDatabase",{foundOrgans:foundOrgans, email:email});
            }else{
                res.render("organDatabase",{foundOrgans:[],email:email});
            }
            
        }
    })
    
});

app.post("/organAdd", function(req, res) {
    const newOrgan = new Organs({
        organ: req.body.organs,
        date: req.body.date,
        time: req.body.time,
        bloodgroup: req.body.bloodGroup,
        parameters: req.body.parameters,
        email: req.session.hospital.email
    })

    newOrgan.save().then(()=>{
        console.log("New organ " + req.body.organs + " has been added");
        res.redirect("/hospitalHome");
    }).catch((err)=>{
        console.log(err);
    })
});


app.listen(3000, function() {
    console.log("Server starting on port 3000");
});

