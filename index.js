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

app.get("/", function(req, res) {
    res.render("home");
});

app.listen(3000, function() {
    console.log("Server starting on port 3000");
});

