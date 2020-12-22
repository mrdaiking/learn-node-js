const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname+"/date.js");

const app = express();

var items = [];
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    let day = date();
    res.render("list", {kindOfDay: day, listItems: items});
   
});

app.post("/", function(req, res){
    var item = req.body.newItem;
    items.push(item);
    res.redirect("/");
});

app.get("/work", function(req,res){
    res.render("list", {kindOfDay: "Work list", listItems: items});
});

app.listen(3000,  function(){
    console.log("Server started on port 3000");
})