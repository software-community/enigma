
import {MongoClient} from 'mongodb'

async function login(req,res){
    const myuser = req.body.user
    const mypass = req.body.pass
    const client = new MongoClient('mongodb://localhost:27017')
    await client.connect()
    let usersCollection = client.db('mydb').collection('users')
    let userObjects = await usersCollection.find().toArray()
    client.close()

    let found = 0
    
    for(let thisObject of userObjects){
        if(myuser == thisObject.user && mypass == thisObject.pass)
            found=1
    }
    if(found==1){
        res.render('user',{myuser})
        console.log(myuser + " just logged in")
    }
    else
        res.send("Username or Password is Incorrect")
}

async function signup(req,res){
    const myuser = req.body.user
    const mypass = req.body.pass
    const client = new MongoClient('mongodb://localhost:27017')
    await client.connect()
    let usersCollection = client.db('mydb').collection('users')
    let userObjects = await usersCollection.find().toArray()

    let found = 0
    
    for(let thisObject of userObjects){
        if(myuser == thisObject.user)
            found=1
    }
    if(found==1)
        res.send("User Aleady Exists")
    else{
        usersCollection.insertOne({"user":myuser,"pass":mypass})
        res.render('index')
        console.log(myuser + " just created an account")
    }
    
    client.close()
}

export {login,signup}