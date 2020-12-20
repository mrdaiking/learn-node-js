const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use("view engine", "ejs");

app.get("/", function(req, res){
    var today = new Date();
    var currentDay = today.getDay();
   res.render("list", {kindOfDay: today})
});

app.listen(3000,  function(){
    console.log("Server started on port 3000");
})