import mongoose from 'mongoose';

const userDataSchema = new mongoose.Schema({
	userName:{
		type:String,
	    required: true
	},
	quatity:{
		type:Number
	},
	cakeID:{
		type:String
	},
	cakeName:{
		type:String
	},
	cakeUrl: {
		type: String
	},
	totalPrice: {
		type: Number
	},
	contact: {
		type: Number
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now
	},
});


const User = new mongoose.model("userData", userDataSchema);
export default User; 