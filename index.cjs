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
app.route("/account").get(async (req,res)=>{
    res.render("account",{
        Name: "Dummy",
        Email: "dummy@example.com",
        quizzes: [
            { name: "somequiz", date: "yesterday", score: "10/10", rank: "1/100" },
            { name: "somequiz", date: "yesterday", score: "10/10", rank: "1/100" }
        ],
        hostedQuizzes: [
            { name: "quiz 1", date: "6 January 2024", participants: 122 }
        ]
    
    })
})
app.route("/grid").get(async (req,res)=>{
    res.render("grid.ejs");
})
app.route("/footer").get(async (req,res)=>{
    res.render("footer.ejs");
})



app.listen(PORT,console.log("server started at port: ", PORT))