import express from 'express'
import bodyParser from 'body-parser'
import {login,signup} from './utils.js'
import quizes from './routes/quizes.js'
const app = express()
const port = 3000
//const host = '172.23.4.246'
const host = 'localhost'

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/',(req,res)=>{
    res.render('index')
    console.log("New Connection : " + req.ip)
})
app.listen(port,host,()=>{
    console.log(`Listening on ${host}:${port}`)
})
app.post('/login',(req,res)=>{
    res.render('login')
})
app.post('/signup',(req,res)=>{
    res.render('signup')
})

app.post('/authlogin',login)

app.post('/authsignup',signup)

app.use('/quizes',quizes)