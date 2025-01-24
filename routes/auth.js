import express from 'express'
const router = express.Router()
import {MongoClient} from 'mongodb'
import crypto from 'crypto'

import passport from 'passport';
import passport_local from 'passport-local'
const LocalStrategy = passport_local.Strategy;

passport.serializeUser((user, done) => {
	done(null, {username: user.username});
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

passport.use(new LocalStrategy(verify));

async function verify(username,password,cb){
    const client = new MongoClient('mongodb://localhost:27017')
    await client.connect()
    let usersCollection = client.db('mydb').collection('users')
    let user = await usersCollection.findOne({username:username})
    client.close()
    
    if(user){
        const myhashedPassword = crypto.pbkdf2Sync(password, user.salt, 100000, 32, 'sha256').toString('hex');
        if(user.hashedPassword == myhashedPassword)
            return cb(null,user)
        else
            return cb(null,false,{ message: 'Incorrect username or password' })
    }
    else
        return cb(null,false,{ message: 'User Not Found' })
    
}

router.get('/',(req,res)=>{
    res.render('404')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '../dashboard',
    failureRedirect: '../login',
    failureFlash: true
  }));

router.post('/signup',async (req,res)=>{
    const myusername = req.body.username
    const mypassword = req.body.password
    const client = new MongoClient('mongodb://localhost:27017')
    await client.connect()
    let usersCollection = client.db('mydb').collection('users')
    
    if(await usersCollection.findOne({username: myusername})){
        req.flash('error','User Already Exists')
        res.redirect('/signup')
        return
    }

    const salt = crypto.randomBytes(16).toString('hex')
    const hashedPassword = crypto.pbkdf2Sync(mypassword, salt, 100000, 32, 'sha256').toString('hex');

    usersCollection.insertOne({"username": myusername,"hashedPassword": hashedPassword,"salt": salt})
    res.render('index')
    console.log(myusername + " just created an account")
    
    client.close()
})

export default router