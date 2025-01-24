import express from 'express'
import quizes from './routes/quizes.js'
import auth from './routes/auth.js'
import flash from 'express-flash';
import session from 'express-session';
import passport from 'passport';

const store = new session.MemoryStore();
const app = express()
const port = 3000

app.set('view engine','ejs')
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: 'my-key',
    resave: false,
    saveUninitialized: false,
    store: store,
    
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
app.get('/dashboard',(req,res)=>{
    if(req.isAuthenticated())
        res.render('dashboard',{username: req.user.username})
    else
        res.render('invalid_session')
})



