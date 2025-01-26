import express from 'express'
import quizes from './routes/quizes.js'
import auth from './routes/auth.js'
import flash from 'express-flash';
import session from 'express-session';
import passport from 'passport';

import { MongoClient } from "mongodb";
const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

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


app.use('/auth',auth)
app.use('/quizes',quizes)

app.get('/',(req,res)=>{
    res.render('index')
    console.log("New Connection : " + req.ip)
})
app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})
app.get('/login',(req,res)=>{
    res.render('login',{ messages: req.flash() })
})
app.get('/signup',(req,res)=>{
    res.render('signup',{ messages: req.flash() })
})
app.get('/dashboard',async (req,res)=>{
    if(req.isAuthenticated()){
        const quizesCreatedId = (await client.db('mydb').collection('users').findOne({username: req.user.username})).quizesCreated
        const quizesCollection = client.db('mydb').collection('quizes')
        let quizesCreated = []
        if(quizesCreatedId)
        for(let Id of quizesCreatedId)
            quizesCreated.push(await quizesCollection.findOne({quizId: Id}))
        
        res.render('dashboard',{username: req.user.username, quizesCreated})
    }
    else
        res.render('invalid_request')
})