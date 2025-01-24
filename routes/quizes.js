import express from "express";
const router = express.Router();
import { MongoClient } from "mongodb";
import bodyParser from "body-parser";

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

router.use(bodyParser.json())

router.get("/", async (req, res) => {
  const quizes = await client.db("mydb").collection("quizes").find().toArray();
  res.render("quizes_homepage", { quizes });
});

router.get("/:slug", async (req, res) => {
  const quizes = await client.db("mydb").collection("quizes").find().toArray();
  let found = 0;
  let myquiz;
  
  for (let quiz of quizes)
    if (quiz.quizId == req.params.slug) {
      found = 1;
      myquiz = quiz;
    }
  
    if (found) {
    let quizname = myquiz.name;
    let quizId = myquiz.quizId;
    let questions = [];
    for (let pair of myquiz.qna) questions.push(pair.question);
    let length = questions.length
    res.render("quiz", { quizname, questions, quizId});
  } else res.send("Quiz not Found");
});

router.post("/:slug/check",async (req,res)=>{
    const myquiz = await client.db("mydb").collection("quizes").findOne({quizId:Number.parseInt(req.params.slug)})
    let useranswers = req.body
    let score = 0
    for(let pair of myquiz.qna)
        if(pair.answer == useranswers[myquiz.qna.indexOf(pair)])
            score++
    res.send(score.toString())
    console.log("Someone just gave "+myquiz.name+" quiz and got score "+score)
})

router.post('/createNewQuiz',async (req,res)=>{
  let newQuiz = req.body
  const quizesCollection = await client.db("mydb").collection("quizes")
  await quizesCollection.insertOne(newQuiz)
  res.end()
  console.log("New Quiz Created : " + newQuiz.name)
})

export default router;
