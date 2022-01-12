import fetch from 'node-fetch'
import express from 'express'
import mongoose from 'mongoose';
const app = express();
import path from 'path';
// const fetch = require('node-fetch');
import fs from 'fs'
import fileUpload from './fileUpload.js'
import cors  from 'cors';
import csvUpload from './csvUpload.js'
import insertManyDJ  from './insertMany.js'
import csv from 'csvtojson'
const port = process.env.PORT || 3001;
//provide schema for dataBase
import userModel  from "./models/UserData.js"
import dotenv from 'dotenv'
import Images from './models/imagesSchema.js'

dotenv.config()

// const fetch = require('node-fetch')

app.use(express.json())
app.use('', express.static('upload/imges'))
app.use(cors());

// mongoose.connect("mongodb+srv://Tejas_Thakare:Tejas@123@crud.1kyta.mongodb.net/userCurd?retryWrites=true&w=majority",{
// 	 useNewUrlParser: true,
// 	 useUnifiedTopology: true,
// })

mongoose.connect("mongodb://localhost/cakeShop", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
const db = mongoose.connection
db.on('error', (error) => console.error("Error Occure ----> "+ error))
db.once('open', ()=> console.log('connected to database'))

//get all info of specific doc by ID Middalware
async function getUserById(req, res, next) {
	let subscriber
	try {
		subscriber = await userModel.findById(req.params.id)
		if (subscriber == null) {
			return res.status(404).json({message: "Can't find subscriber"})
		}

	} catch (e) {
		return res.status(500).json({message: e.message})
	}
	res.subscriber = subscriber
	next()
}

app.get('/', async (req, res)=>{
	res.send("We are here");
})

//read data from dataBase
app.get('/read', async (req, res)=>{
	userModel.find({}, (err, result)=>{
		if(err){
			res.send(err);
		}
		res.send(result);
	})
})

//insert Data in DataBase  fileUpload.single('photoimg')
app.post('/insert', async (req, res)=>{
	const userName = req.body.userName
	const quatity = req.body.quatity
	const cakeID = req.body.cakeID
	const cakeName = req.body.cakeName
	const cakeUrl  = req.body.cakeUrl
	const totalPrice = req.body.totalPrice
	const contact = req.body.contact
	const user = new userModel({
		userName,
		quatity,
		cakeID,
		cakeName,
		cakeUrl,
		totalPrice,
		contact,
	})
	
	try{
	   const newSubscriber = await user.save()
	   // const img  = await imgSave.save()
	   res.status(201).json(newSubscriber)
	}catch(err){
		console.log(err);
	}
})

app.post('/update', async (req, res)=>{
	const updateId = req.body._id;
	const userName = req.body.userName
	const quatity = req.body.quatity
	const cakeID = req.body.cakeID
	const cakeName = req.body.cakeName
	const cakeUrl  = req.body.cakeUrl
	const totalPrice = req.body.totalPrice
	const contact = req.body.contact
	try{
	   await userModel.updateOne({_id:`${updateId}`}, {$set: {
			userName,
			quatity,
			cakeID,
			cakeName,
			cakeUrl,
			totalPrice,
			contact
	   }});
	   res.send("Data is Updated");
	}catch(err){
		console.log(err);
	}
})

//delete Data from dataBase
app.post('/delete', async (req, res)=>{
	const deleteId = req.body.deleteId;
	try{
	   await userModel.deleteMany({_id:deleteId})
	   res.send("Data is Deleted");
	}catch(err){
		console.log(err);
	}
})


app.get('/readData/:id', getUserById, async (req, res)=>{
	res.json(res.subscriber)
})

//delete Many
app.post('/deleteManyById', async (req, res) => {
	const id = req.body.deleteManyById
	try {
		const manyDelete = await userModel.deleteMany({
														    "_id": {
														        "$in": id
														        }
														 }) 
		console.log(manyDelete)
		res.status(201).json(manyDelete)
	} catch (e) {
		res.status(500).json({message: e.message})
	}
})


//extarnal Routes
import imagesRouter from './imagesRoutes.js'
app.use('/images', imagesRouter)

import cakeRouter from './cakeRoute.js'
app.use('/cake', cakeRouter)

app.listen(port, ()=>{
	console.log("server is runing on "+port);
})