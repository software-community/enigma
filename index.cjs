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

app.route("/stats").get(async (req,res)=>{
    res.render("stats.ejs", {
        quizName: "Sample Quiz",
        quizDate: "32 January 3939",
        quizRank: 22,
        totalParticipants: 100,
        data: [
            { sn: "Q1", time: 25, verdict: "correct", statement: "What is the capital of France?", option: "Paris, Berlin, London, Madrid", response: "Paris", answer: "Paris" },
            { sn: "Q2", time: 40, verdict: "incorrect", statement: "Solve for x: 2x + 3 = 7", option: "1, 2, 3, 4", response: "3", answer: "2" },
            { sn: "Q3", time: 35, verdict: "correct", statement: "Which planet is known as the Red Planet?", option: "Earth, Venus, Mars, Jupiter", response: "Mars", answer: "Mars" },
            { sn: "Q4", time: 50, verdict: "incorrect", statement: "Name the author of 'To Kill a Mockingbird'.", option: "Harper Lee, J.K. Rowling, Ernest Hemingway, Mark Twain", response: "Mark Twain", answer: "Harper Lee" },
            { sn: "Q5", time: 30, verdict: "correct", statement: "What is the chemical symbol for water?", option: "H2O, CO2, NaCl, O2", response: "H2O", answer: "H2O" },
            { sn: "Q6", time: 45, verdict: "correct", statement: "How many continents are there on Earth?", option: "5, 6, 7, 8", response: "7", answer: "7" },
            { sn: "Q7", time: 20, verdict: "incorrect", statement: "What is the largest ocean on Earth?", option: "Atlantic, Indian, Arctic, Pacific", response: "Atlantic", answer: "Pacific" },
            { sn: "Q8", time: 55, verdict: "correct", statement: "What is the powerhouse of the cell?", option: "Nucleus, Mitochondria, Ribosome, Endoplasmic Reticulum", response: "Mitochondria", answer: "Mitochondria" },
            { sn: "Q9", time: 25, verdict: "correct", statement: "Which country is the largest by area?", option: "China, Canada, USA, Russia", response: "Russia", answer: "Russia" },
            { sn: "Q10", time: 35, verdict: "incorrect", statement: "Who painted the Mona Lisa?", option: "Vincent van Gogh, Pablo Picasso, Leonardo da Vinci, Michelangelo", response: "Pablo Picasso", answer: "Leonardo da Vinci" }
        ]
    })
})

app.listen(PORT,console.log("server started at port: ", PORT))