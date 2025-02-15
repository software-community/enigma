import express from 'express'
import quizes from './routes/quizes.js'
import auth from './routes/auth.js'
import flash from 'express-flash';
import session from 'express-session';
import passport from 'passport';
import multer from 'multer';

import { MongoClient } from "mongodb";
const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

const storage = multer.diskStorage({
    destination: "./public/profilePics",
    filename: (req, file, cb) => {
        cb(null, "profile-"+req.user.username);
    },
});
const upload = multer({ storage });
const store = new session.MemoryStore();
const app = express()
const port = 3000

app.set('view engine','ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(session({
    secret: 'my-key',
    resave: false,
    saveUninitialized: false,
    store: store
  }));
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static('public'));


app.use('/auth',auth)
app.use('/quizes',quizes)

app.get('/',async (req,res)=>{
    if(req.isAuthenticated())
    res.redirect('/dashboard')
    else{
        const quizes = await client.db("mydb").collection("quizes").find().toArray();
        // const featuredQuizes = quizes.map((quiz)=>{
        //     return {quizname:quiz.name, quizId:quiz.quizId}
        // })
        let featuredQuizes = []
        for(let i=0;i<3;i++)
            featuredQuizes.push({quizname:quizes[i].name, quizId:quizes[i].quizId})
        res.render('homepage',{featuredQuizes})
    }
    // console.log("New Connection : " + req.ip)
})
app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})
app.get('/login',(req,res)=>{
    if(req.isAuthenticated())
        res.redirect('/')
    else
        res.render('login',{ messages: req.flash() })
})
app.get('/signup',(req,res)=>{
    if(req.isAuthenticated())
        res.redirect('/')
    else
        res.render('signup',{ messages: req.flash() })
})
app.get('/dashboard',async (req,res)=>{
    if(req.isAuthenticated()){
        const quizes = await client.db("mydb").collection("quizes").find().toArray();
        // const featuredQuizes = quizes.map((quiz)=>{
        //     return {quizname:quiz.name, quizId:quiz.quizId}
        // })
        let featuredQuizes = []
        if(quizes.length!=0){
        for(let i=0;i<3;i++)
            featuredQuizes.push({quizname:quizes[i].name, quizId:quizes[i].quizId})
    }
        res.render('dashboard',{username: req.user.username, featuredQuizes})
    }
    else
        res.redirect('/login')
})
app.get('/profile',async (req,res)=>{
    if(req.isAuthenticated()){
        const quizesCreatedId = (await client.db('mydb').collection('users').findOne({username: req.user.username})).quizesCreated
        let quizesTaken = (await client.db('mydb').collection('users').findOne({username: req.user.username})).taken
        const quizesCollection = client.db('mydb').collection('quizes')
        let quizesCreated = []
        let quizesScheduled = []
        const dateObj = new Date()
        const currentDate = (dateObj.toISOString()).slice(0,10)
        const currentTime = (dateObj.toTimeString()).slice(0,5)
        
        if(!quizesTaken)
            quizesTaken = []
        if(quizesCreatedId)
        for(let Id of quizesCreatedId) {
            let quiz = await quizesCollection.findOne({quizId: Id})
            if(!quiz)
                continue
            let date = quiz.date
            let time = quiz.time
            if(!date || !time){
                date="2025-01-01"
                time="00:00"
                quiz.date = date
                quiz.time = time
            }
        
            if(date < currentDate || (date==currentDate && time<=currentTime))
                quizesCreated.push({name:quiz.name,quizId:quiz.quizId,date:quiz.date,takers:quiz.takers})
            else
                quizesScheduled.push({name:quiz.name,quizId:quiz.quizId,date:quiz.date,takers:quiz.takers})
        }

        quizesCreated.sort((quiz1,quiz2)=>{
            let a = 0
            if(quiz1.date > quiz2.date)
                a=-1
            else if(quiz1.date < quiz2.date)
                a=1
            return a
        })
        quizesScheduled.sort((quiz1,quiz2)=>{
            let a = 0
            if(quiz1.date > quiz2.date)
                a=-1
            else if(quiz1.date < quiz2.date)
                a=1
            return a
        })
        
        res.render('profile',{username: req.user.username, quizesCreated, quizesScheduled, quizesTaken, email:"example@gmail.com"})
    }
    else
        res.redirect('/login')
})
app.post('/uploadProfilePic',upload.single('profile'), (req,res,next)=>{
    if(req.isAuthenticated()){
        res.sendStatus(200)
    }
    else
        res.redirect('/')
})