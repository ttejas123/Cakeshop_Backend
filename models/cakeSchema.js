import mongoose from 'mongoose';

const cakeSchema = new mongoose.Schema({
	name:{
		type:String
	},
	description: {
		type: String
	},
	price:{
		type:Number
	},
	url: {
		type: String
	},
});


const Cake = new mongoose.model("cakeSchema", cakeSchema);
export default Cake;