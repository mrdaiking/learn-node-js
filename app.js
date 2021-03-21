const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");
const date = require(__dirname + "/date");

const PORT = 3000;


const app = express();

const items = ["Banana", "Orange", "Apple"];
const workItems = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Connect database by mongoose
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});


//Create schema like a table in database
const itemsSchema = {
    name: String
};

const listSchema = {
    name: String,
    items: [itemsSchema]
};

//Mapping model into Item object

const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to aff a new item. "    
});

const item3 = new Item({
    name: "<-- Hit this to delete an item. "
});

const defaultItems = [item1, item2, item3];




app.get("/", function(req, res){

    const day = date.getDate();
    Item.find({}, function(err,foundItems){
        if(foundItems.length === 0) {
            Item.insertMany(defaultItems,function(err){
                if(err) {
                    console.log("Error inserting");
                } else {
                    console.log("Inserting Success");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {listTitle: day, newListItems: foundItems});
        }
    });
});

app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);

  
    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if(!foundList) {
                //Create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect('/'+ customListName);
            } else {
                //Show an existing list
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
            }
        }
    })
});

app.post("/", function(req, res){
    console.log("");
    const day = date.getDate();
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });
    


    if (listName == day){
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, function(err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        });
    }
});

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    console.log("----DEL--ID----", checkedItemId);
    const day = date.getDate();
    if(listName === day) {
        Item.findByIdAndRemove(checkedItemId, function(err){
            if(err){
                console.log("Delete failed");
                
            } else {
                console.log("Delete sussesfully!")
                res.redirect("/")
            }
        });
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
            if(!err) {
                res.redirect("/" + listName);
            }
        });
    }
   
});

app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.post("/work", function(req, res){
    const item = req.body.newItem;
    workItems.push(item);
    res.redirect("/");
});


app.get("/about", function(req, res){
    const item = req.body.newItem;
    workItems.push(item);
    res.render("about", {startingContent: "About content"});
});

app.listen(PORT,  function(){
    console.log("Server started on port : ", PORT);
});
