import express from "express";
const router = express.Router();
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

import multer from 'multer';

const storage = multer.diskStorage({
  destination: "./public/quizBanners",
  filename: (req, file, cb) => {
    cb(null, `quiz-${req.body.quizId}`);
  },
});
const upload = multer({ storage });

function ranker(takers){
  return takers.sort((a, b) => {
    if (b.score === a.score) {
      return takers.indexOf(a) - takers.indexOf(b);
    }
    return b.score - a.score;
  });
}

router.get("/", async (req, res) => {
  const quizes = await client.db("mydb").collection("quizes").find().toArray();
  res.render("quizes_homepage", { quizes });
});

router.post('/startquiz',(req,res)=>{
  if(req.isAuthenticated())
    res.redirect(307,'/quizes/quiz')
  else
    res.render('startquiz',{quizname:req.body.quizname,quizId: req.body.quizId})
})

router.post("/quiz", async (req, res) => {
  const myquiz = await client.db("mydb").collection("quizes").findOne({quizId: Number.parseInt(req.body.quizId)})
  
  if (myquiz) {
    let quizname = myquiz.name;
    let quizId = myquiz.quizId;
    let hours = myquiz.hours ? myquiz.hours : "0"
    let mins = myquiz.mins ? myquiz.mins : "0"
    let questions = [];
    for (let pair of myquiz.qna) questions.push({question: pair.question, optionA: pair.optionA, optionB: pair.optionB, optionC: pair.optionC, optionD: pair.optionD});
    let name = (req.body.mode=='guest') ? req.body.name : req.user.username
    if(req.isAuthenticated())
    res.render("quiz", { name, quizname, questions, quizId, hours, mins, username: req.user.username});
    else
    res.render("quiz", { name, quizname, questions, quizId, hours, mins});
  } else res.send("Quiz not Found");
});

router.post("/check",async (req,res)=>{
    const quizesCollection = client.db("mydb").collection("quizes")
    let myquiz = await quizesCollection.findOne({quizId:Number.parseInt(req.body.quizId)})
    delete myquiz.takers
    let useranswers = req.body.answers
    let score = 0
    for(let pair of myquiz.qna) {
      let index = myquiz.qna.indexOf(pair)
      if(useranswers[myquiz.qna.indexOf(pair)])
        if(pair.correctOption == useranswers[myquiz.qna.indexOf(pair)]){
            score++
            await quizesCollection.updateOne({quizId: Number.parseInt(req.body.quizId)},{ $set: {[`qna.${index}.correctlyAnswered`]: myquiz.qna[index].correctlyAnswered+1}})
        }
        else
          await quizesCollection.updateOne({quizId: Number.parseInt(req.body.quizId)},{ $set: {[`qna.${index}.incorrectlyAnswered`]: myquiz.qna[index].incorrectlyAnswered+1}})
      else
        await quizesCollection.updateOne({quizId: Number.parseInt(req.body.quizId)},{ $set: {[`qna.${index}.notAnswered`]: myquiz.qna[index].notAnswered+1}})
      }
    await quizesCollection.updateOne({quizId: Number.parseInt(req.body.quizId)},{ $push: { takers: {name: req.body.name, score: score} } })
    if(req.isAuthenticated())
      await client.db("mydb").collection("users").updateOne({username:req.body.name},{ $push: { taken: {takenId:req.body.takenId, quiz:myquiz, answers: useranswers, score, date: ((new Date()).toISOString()).slice(0,10)} } })
    
    // res.send(score.toString())
    console.log(req.body.name+" just gave "+myquiz.name+" quiz and got score "+score)
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

router.post('/uploadQuizBanner',upload.fields([{ name: "quizImage", maxCount: 1 }]), (req,res,next)=>{
  if(req.isAuthenticated()){
      res.sendStatus(200)
  }
  else
      res.redirect('/')
})

router.post('/quizResult', async (req,res)=>{
  if(req.isAuthenticated()){
    const quizesCollection = client.db("mydb").collection("quizes")
    let myquiz = await quizesCollection.findOne({quizId:Number.parseInt(req.body.quizId)})
    if(!myquiz.takers)
      myquiz.takers = []
    myquiz.takers = ranker(myquiz.takers)
    if(myquiz.author == req.user.username){
      if(typeof myquiz.qna[0].correctlyAnswered === "undefined")
        for(let i=0;i<(myquiz.qna).length;i++){
        myquiz.qna[i].correctlyAnswered = 0
        myquiz.qna[i].incorrectlyAnswered = 0
        myquiz.qna[i].notAnswered = 0
      }
      res.render('host_stats',{myquiz})
    }
    else
      res.redirect('/login')
  }
  else
  res.redirect('/login')
  
})

router.post('/continueAsUser',(req,res)=>{
  if(req.isAuthenticated()){
    res.redirect(307,'/quizes/quiz')
  }
  else
    res.redirect('../login')
})

router.post('/stats',async (req,res)=>{
  if(req.isAuthenticated()){
    const quizesTaken = (await client.db("mydb").collection("users").findOne({username:req.user.username})).taken
    let leaderboard = (await client.db("mydb").collection("quizes").findOne({quizId:Number.parseInt(req.body.quizId)})).takers
    if(!leaderboard)
      leaderboard = []
    leaderboard = ranker(leaderboard)
    let myQuizTaken
    for(let quizTaken of quizesTaken)
      if(quizTaken.quiz.quizId == Number.parseInt(req.body.quizId))
        myQuizTaken = quizTaken
    if(!myQuizTaken.date)
      myQuizTaken.date = "2025-01-15"
    res.render('stats',{myQuizTaken, leaderboard, username:req.user.username})
  }
  else
    res.redirect('../login')
})

router.get('/join',(req,res)=>{
  if(req.isAuthenticated())
    res.render('join_quiz',{ messages : req.flash(), username:req.user.username})
  else
    res.render('join_quiz',{ messages : req.flash() })
})

router.post('/joinQuiz',async (req,res)=>{
  const myquiz = await client.db("mydb").collection("quizes").findOne({quizId:Number.parseInt(req.body.quizId)})
  if(myquiz){
    res.status(200)
    res.send({quizname:myquiz.name, quizId:myquiz.quizId})
  }
  else
    res.sendStatus(404)
})

router.get('/create',(req,res)=>{
  if(req.isAuthenticated())
  {
    res.render('create_quiz',{username:req.user.username})
  }
  else
    res.redirect('/login')
})
export default router;
