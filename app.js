const express = require("express");
const bodyParser = require("body-parser");
const _ = require('lodash')
const mongoose= require("mongoose");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin-aditya:password@cluster0.g1i1dhw.mongodb.net/toDoListDB', {useNewUrlParser: true});
var item = "";

// const itemShema = new mongoose.Schema({
//     name: String,
// });
const itemSchema = {
    name: String,
};


const itemModel= mongoose.model("Item", itemSchema);

const item1 = new itemModel({
  name: "Buy Food",
});

const item2 = new itemModel({
  name: "Cook Food",
});

const item3 = new itemModel({
  name: "Eat Food",
});

const defaultItems= [item1, item2, item3];

const ListSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});

const listModel= mongoose.model("List", ListSchema);

app.set('view engine', 'ejs');

app.get("/", function (req, res) {
  itemModel.find().then(function(foundItems){
    if(foundItems.length===0){
      itemModel.insertMany(defaultItems).then(function(){
        console.log('Inserted');
      }).catch(function(err){
        console.log(err);
      });
      res.redirect();
      
    } else{
    res.render("list", { listTitle: "Today", newItems: foundItems});
    }
  })
  
 //res.sendFile(__dirname + "/views/list.ejs");
});

app.get("/:customListName", function(req, res){
  const customListName= _.capitalize(req.params.customListName);

  const list = new listModel({
    name: customListName,
    items:  defaultItems,
  }); 

  listModel.findOne({name: customListName}).then(function(err, foundList){
    if(!err){
      if(!foundList){
        console.log("Doesn't exist");
        list.save();
        res.redirect("/" + customListName);
      }
    } else {
      console.log("exists!");
      res.render("list", {listTitle: err.name, newItems: err.items});
    }
  });

});

app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    const listName=req.body.list;

    const newItem=new itemModel({
      name: itemName,
    });

    if(listName==="Today"){
      newItem.save();
      res.redirect("/");

    } else{
      listModel.findOne({name: listName}).then(function(foundList){
        foundList.items.push(newItem);
        foundList.save();
      });

      res.redirect("/"+listName);
    }

    // itemModel.insertMany(newItem);
   
});


app.post("/delete", function(req, res){
  const checkedItemId=req.body.checkbox;
  const listName=req.body.listName;
  console.log(listName);
  
  if(listName==="Today"){
  //   itemModel.deleteOne({ _id: checkedItemId}).then(function(){
  //     console.log("deleted"); // Success
  //  }).catch(function(error){
  //     console.log(error); // Failure
  // });
  
  //another method
  itemModel.findByIdAndRemove(checkedItemId).then(function(){
    console.log("deleted");
  }).catch(function(err){
    console.log(err);
  });

  res.redirect("/");

} else{
  listModel.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}).then(function(){
    console.log('deleted');
  });
  res.redirect("/"+listName);
}

});


app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work List", newItems: workItems });
});

app.get("/about", function (req, res) {
    res.render("about");
})
app.listen(3000, function () {
    console.log("server started at port 3000.");
});