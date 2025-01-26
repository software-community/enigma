import express from "express";
const router = express.Router();
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();


router.get("/", async (req, res) => {
  const quizes = await client.db("mydb").collection("quizes").find().toArray();
  res.render("quizes_homepage", { quizes });
});

router.post('/startquiz',(req,res)=>{
  res.render('startquiz',{quizname:req.body.quizname,quizId: req.body.quizId})
})

router.post("/quiz", async (req, res) => {
  const myquiz = await client.db("mydb").collection("quizes").findOne({quizId: Number.parseInt(req.body.quizId)})
  
  if (myquiz) {
    let quizname = myquiz.name;
    let quizId = myquiz.quizId;
    let questions = [];
    for (let pair of myquiz.qna) questions.push(pair.question);
    let name = (req.body.mode=='guest') ? req.body.name : req.user.username
    res.render("quiz", { name, quizname, questions, quizId});
  } else res.send("Quiz not Found");
});

router.post("/check",async (req,res)=>{
    const quizesCollection = client.db("mydb").collection("quizes")
    const myquiz = await quizesCollection.findOne({quizId:Number.parseInt(req.body.quizId)})
    let useranswers = req.body.answers
    let score = 0
    for(let pair of myquiz.qna)
        if(pair.answer == useranswers[myquiz.qna.indexOf(pair)])
            score++
    quizesCollection.updateOne({quizId: Number.parseInt(req.body.quizId)},{ $push: { takers: {name: req.body.name, score: score} } })
    res.send(score.toString())
    console.log("Someone just gave "+myquiz.name+" quiz and got score "+score)
})

router.post('/createNewQuiz',async (req,res)=>{
  let newQuiz = req.body.quiz
  const quizesCollection = client.db("mydb").collection("quizes")
  const usersCollection = client.db("mydb").collection("users")
  await quizesCollection.insertOne(newQuiz)
  await usersCollection.updateOne({username: req.body.username},{$push: { quizesCreated: newQuiz.quizId }})
  res.end()
  console.log("New Quiz Created : " + newQuiz.name)
})

router.post('/quizResult', async (req,res)=>{
  if(req.isAuthenticated()){
    const quizesCollection = client.db("mydb").collection("quizes")
    const myquiz = await quizesCollection.findOne({quizId:Number.parseInt(req.body.quizId)})

    if(myquiz.author == req.user.username){
      res.render('quizResult',{myquiz})
    }
    else
      res.render('invalid_request')
  }
  else
    res.render('invalid_request')
  
})

router.post('/continueAsUser',(req,res)=>{
  if(req.isAuthenticated()){
    res.redirect(307,'/quizes/quiz')
  }
  else
    res.redirect('../login')
})

export default router;
