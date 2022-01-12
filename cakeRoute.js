import express from 'express'
const router  = express.Router()
import multer from 'multer'
import dotenv from 'dotenv'
dotenv.config()

import fs from 'fs'
import fileUpload from './fileUpload.js'
//const csvUpload from './csvUpload')
import path from 'path'
//const csfrom 'csvtojson')
import CakeSchema from './models/cakeSchema.js'
import Images from './models/imagesSchema.js'

//get all info of specific doc by ID Middalware
async function getImg(req, res, next) {
	let subscriber
	try {
		subscriber = await CakeSchema.findById(req.params.id)
		if (subscriber == null) {
			return res.status(404).json({message: "Can't find subscriber"})
		}

	} catch (e) {
		return res.status(500).json({message: e.message})
	}
	res.subscriber = subscriber
	next()
}


//Get ALL
router.get('/', async (req, res) => {
	try {

		// const allImg = await CakeSchema.find().limit(3).skip(1)
		const allImg = await CakeSchema.find()
		let i = 0
		let arr = []
		let urls = []
		while(i < allImg.length) {
					const dd = "" + allImg[i]._id + ""
					urls.push({[`${i}${allImg[i].name}`]  : process.env.BASEURL + allImg[i].url})
					arr.push(dd)
					i++
			}
		let dataSend = JSON.stringify({deleteManyById: arr}, null, 2) 
		fs.writeFile('deleteId.json', dataSend, finished)
		function finished(err) {
			console.log('all set.')
		}
		res.status(201).json({data: allImg, urls})
	} catch (e) {
		res.status(404).json({message: e.message})
	}
})

//Get One 2
router.get('/:id', getImg, async (req, res) => {
	res.json(res.subscriber)
})

//Create One fileUpload.array('photoimg[]')
router.post('/insert', fileUpload.single('photoimg'), async (req, res)=> {
	const val = req.file;
	const nameD = req.body.name
	const priceD= req.body.price
	const descriptionD = req.body.description
	const urlD = val.filename
	const cake = new CakeSchema({
		name: nameD,
		price: priceD,
		description: descriptionD,
		url: urlD
	})
	const imgSave = new Images({
		name: val.originalname,
	 	url: val.filename,
	 	size: val.size,
	 	ext: val.mimetype
	})
	try{
	   const newSubscriber = await cake.save()
	   const img  = await imgSave.save()
	   res.status(201).json(newSubscriber)
	}catch(err){
		console.log(err);
	}
})

//delete Many
router.post('/deleteManyById', async (req, res) => {
	const id = req.body.deleteManyById
	try {
		const manyDelete = await CakeSchema.deleteMany({
														    "_id": {
														        "$in": id
														        }
														 }) 
		res.status(201).json(manyDelete)
	} catch (e) {
		res.status(500).json({message: e.message})
	}
})

export default router