const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var item = "";
var items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];
app.set('view engine', 'ejs');
app.get("/", function (req, res) {

    let day = date.getDate();

    res.render("list", { listTitle: day, newItems: items });
    res.sendFile(__dirname + "./list.ejs");
});

app.post("/", function (req, res) {
    item = req.body.newItems;
    // console.log(item);
    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
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