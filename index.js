import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

import express from 'express'
import hbs from 'hbs'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import {readposts, readusers, insertposts, insertusers, likeFun,  shareFun, deleteFun} from './operations.js'
const app = express()

mongoose.connect("mongodb://127.0.0.1:27017/cinema",{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const screen1Model = mongoose.model('screen1',{
    seatno:{type:Number},
    status:{type:String}
})

const screen2Model = mongoose.model('screen2',{
    seatno:{type:Number},
    status:{type:String}
})

const screen3Model = mongoose.model('screen3',{
    seatno:{type:Number},
    status:{type:String}
})

const moviesModel = mongoose.model('movies',{
    name:{type:String},
    rate:{type:Number},
    screenNo:{type:Number}
})

var screen1Res
screen1Model.find()
.then(function(output){
    screen1Res = output
})
.catch(function (err){
    console.log(err)
})

var screen2Res
screen2Model.find()
.then(function(output){
    screen2Res = output
})
.catch(function (err){
    console.log(err)
})

var screen3Res
screen3Model.find()
.then(function(output){
    screen3Res = output
})
.catch(function (err){
    console.log(err)
})

var moviesRes
moviesModel.find()
.then(function(output){
    moviesRes = output
})
.catch(function (err){
    console.log(err)
})

app.set('view engine', 'hbs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
     extended: true
}))

app.use(cookieParser())

app.get('/',(req, res)=>{
    res.render("login")
})

app.post('/login',async(req, res)=>{
    const output = await readusers(req.body.profile)
    const password = output[0].password
    if(password === req.body.password)
    {
        const secret="03f50c87759883f92149d6a60e4987fb21accab9bd7d5ec29cde0554d174d5e3e75d65cdac93f3d114429800ccd4a8c18ebcea91731df22fc3a0a68d8f93f606"
        const payload = {"profile":output[0].profile, "name":output[0].name,"headline":output[0].headline}
        const token=jwt.sign(payload,secret)
        res.cookie("token",token)
        res.redirect("/posts")
    }
    else{
        res.send("Incorrect Username or Password")
    }

})
  
app.get('/posts',verifylogin,async (req, res)=>{
    const output = await readposts()
    res.render("posts",{
        data:output,
        userInfo:req.payload
    })
})

app.post('/like',async(req,res)=>{
    await likeFun(req.body.content)
    res.redirect('/posts')
})

app.post('/share',async(req,res)=>{
    await shareFun(req.body.content)
    res.redirect('/posts')
})

app.post('/delete',async(req,res)=>{
    await deleteFun(req.body.content)
    res.redirect('/posts')
})

app.post('/addposts',async(req,res)=>{
    await insertposts(req.body.profile,req.body.content)
    res.redirect("/posts")
})

function verifylogin (req,res,next){
    const secret="03f50c87759883f92149d6a60e4987fb21accab9bd7d5ec29cde0554d174d5e3e75d65cdac93f3d114429800ccd4a8c18ebcea91731df22fc3a0a68d8f93f606"
    const token=req.cookies.token
    jwt.verify(token,secret,(err,payload)=>{
        if(err) return res.sendStatus(403)
        req.payload = payload
    })
    next()
}

app.post('/addusers',async(req,res)=>{
    if(req.body.password === req.body.cnfpassword)
    {
        await insertusers(req.body.name,req.body.profile,req.body.password,req.body.headline)
        res.redirect('/')
    }
    else{
        res.send("Password and confirm password Did not Match")
    }

})

app.get('/register',(req,res)=>{
    res.render("register")
})

app.listen(3000,()=>{
    console.log("Listening...")
})


app.get('/cinema',(req,res)=>{
    res.render("cinema",{
        movies:moviesRes,
        screen1:screen1Res,
        screen2:screen2Res,
        screen3:screen3Res
    })
})

app.use(express.static(path.join(__dirname,"public")))