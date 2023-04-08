//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const password = "shreyansh";

//   bcrypt
//   .compare(password, a)
//   .then(res => {
//     console.log("Matching") // return true
//   })
//   .catch(err => console.error(err.message))

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

//Replace this with our schema
const HospitalSchema = new mongoose.Schema({
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
    emailOfficer:String,
    contactNoOfficer:String
})

const DonorSchema = {
    donorName: String,
    state: String,
    city: String,
    contactNo:String,
    email: String,
    password: String,
    age: Number
}

const AlertsSchema = {
    donorOrgan: String,
    donorUrgency: String,
    donorText: String,
    email: String
}

const OrgansSchema = {
    organ: String,
    date: String,
    time: String,
    bloodgroup: String,
    parameters: String,
    email: String
}


const ngoSchema = {
    name: String,
    regNo: String,
    ngoWebsite: String,
    ngoEmail: String,
    ngoProposal: String
}

HospitalSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

HospitalSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const Hospital = mongoose.model("Hospital", HospitalSchema); //add collection name here
const Donor = mongoose.model("Donor",DonorSchema);
const Alerts = mongoose.model("Alerts",AlertsSchema);
const Organs = mongoose.model("Organs",OrgansSchema);
const Info = mongoose.model("Ngo",ngoSchema);

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
        town:req.body.town,
        Address:req.body.hospitalAddress,
        PinCode: req.body.pincode,
        Website:  req.body.hospitalWebsite,
        HospitalLogo: req.body.hospitalLogo,
        Specialization: req.body.specialization,
        AddressOfficer: req.body.nodalOfficerAddress,
        contactNoOfficer: req.body.nodalOfficerContactNo,
        emailOfficer: req.body.nodalOfficerEmail
    });
    
    newUser.password = newUser.generateHash(req.body.password);
    console.log(newUser.password);

    newUser.save().then(()=>{
        res.render("loginHospital");
        console.log("New Hospital " + req.body.hospName + " account has been registered");
    }).catch((err)=>{
        console.log(err);
    })
});

app.post("/loginHospital", function(req, res){
    const email = req.body.email;
    const password = req.body.password;

    Hospital.findOne({email: email}).then((foundUser)=>{
        if (!foundUser.validPassword(req.body.password)) {
            console.log("Password did not match");
        } else {
            req.session.hospital= foundUser;
            req.session.save();
            console.log("User " + email + " has been successfully logged in");
            res.redirect("/hospitalHome");
        }
    })
});

app.get("/logout",function(req,res){
    req.session.destroy();
    res.redirect("/")
});

app.get("/signUp",function(req,res){
    res.render("signUp");
});


//   DONOR


app.get("/profileDonor",function(req,res){
    res.render("profileDonor");
});

app.get("/loginDonor", function(req, res) {
    if(req.session.donor){
        res.render("donorHome");
    }else{
        res.render("donorLogin");
    }
});

app.get("/signUpDonor", function(req, res) {
    res.render("signUpDonor");
});

app.get("/donorHome", function(req, res) {
    if(req.session.donor){
        console.log(req.session.hospital);
        res.render("donorHome");
    }
    else{
        res.redirect("/loginDonor");
    }
    
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
        res.render("donorLogin");
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

//Hospital page

app.get("/request",function(req,res){
    res.render('hospitalRequest');

});

app.get("/address",function(req,res){
    res.render("hospitalAddress");
});

app.get("/database",function(req,res){
    res.render("hospitalDatabase");
})

app.get("/alert",function(req,res){

    const email = req.session.email;
    Alerts.find({},function(err,foundAlerts){
        if(!err){
            if(foundAlerts){
                Hospital.find({},function(err,foundHospitals){
                    if(!err){
                        res.render("hospitalAlerts",{foundAlerts: foundAlerts, foundHospitals: foundHospitals,email: email});
                    }
                })
            }else{
                res.render("hospitalAlerts",{foundAlerts:[],foundHospitals:[],email: email});
            }
        }
    })
    
});

app.get("/success",function(req,res){
    res.render("hospitalSuccess");
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

// app.post("/show",function(req,res){
//     // const query = {$text: {$search: req.body.search}};

//     const projection={
//         _id: 0,
//         organ: 1,
//         date: 0,
//         time: 0,
//         bloodgroup: 1,
//         parameters: 0,
//         email: 0

//     };

//     const cursor = Organs.findOne({$text: {$search: req.body.search}}, {projection: {_id: 0,
//         organ: 1,
//         date: 0,
//         time: 0,
//         bloodgroup: 1,
//         parameters: 0,
//         email: 0}});
//     cursor.stream().on("data",doc => console.log(doc));

// });



app.get("/organAdd",function(req,res){

    res.render("organAdd");
});

app.post("/hospitalRequest", function(req, res) {
    const newAlert = new Alerts({
        donorOrgan : req.body.organ,
        donorUrgency : req.body.urgency,
        donorText : req.body.text,
        email: req.session.hospital.email
    });

    newAlert.save().then(()=>{
        res.render("hospitalRequest");
        console.log("New Alert " + req.body.organ + " has been made");
    }).catch((err)=>{
        console.log(err);
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



app.get("/ngo", function(req,res){
    res.render("NGO");
}) 

app.post("/ngo", function(req,res){
    const ngoInfo = new Info({
        name: req.body.ngoName,
        regNo: req.body.regNo,
        ngoWebsite: req.body.ngoWebsite,
        ngoEmail: req.body.email,
        ngoProposal: req.body.ngoProposal
    })

    ngoInfo.save().then(()=>{
        console.log("Ngo " + req.body.ngoName + " is saved");
        res.render("NGO");
    }).catch((err)=>{
        console.log(err);
    })
})

app.get("/nearYou", function(req,res){
    res.render("nearYou");
})

app.get("/ngo", function(req,res){
    res.render("NGO");
}) 

app.post("/ngo", function(req,res){
    const ngoInfo = new Info({
        name: req.body.ngoName,
        regNo: req.body.regNo,
        ngoWebsite: req.body.ngoWebsite,
        ngoEmail: req.body.email,
        ngoProposal: req.body.ngoProposal
    })

    ngoInfo.save().then(()=>{
        console.log("Ngo " + req.body.ngoName + " is saved");
        res.render("NGO");
    }).catch((err)=>{
        console.log(err);
    })
})

app.get("/awareness",function(req,res){
    res.render("organDonationAwareness");
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

app.get("/profileHospital",function(req,res){

    const email = req.session.hospital.email;
    Hospital.find({},function(err,foundHospital){
        console.log(foundHospital);
        res.render("profileHospital",{foundHospital:foundHospital,email:email});
    });
    
});

// Donor nav bar

app.get("/donorForm",function(req,res){
    res.render("donorForms");
});

app.get("/donorProfile",function(req,res){
    res.render("donorProfile");
});

app.get("/donorReports",function(req,res){
    res.render("donorReports");

});

app.get("/nearYou", function(req,res){
    res.render("nearYou");
})



app.listen(3000, function() {
    console.log("Server starting on port 3000");
});