const express = require("express")
const mongoose = require("mongoose")
const path = require("path")

const app = express();
const PORT = 9000;

app.set("views",path.join(__dirname,"views"));
app.set("view engine" , "ejs")

app.use(express.static(path.join(__dirname,"public")));

app.route("/dashboard").get(async(req,res)=>{
    res.render("dashboard");
})


app.listen(PORT,console.log("server started at port: ", PORT))