const express = require("express");
const app = express();
const mongoose = require("mongoose");

async function connect(){
	try {
			await mongoose.connect(process.env.MONGO_URI);
			console.log("connected to MongoDB");
	}
	catch {
			console.log(error);
	}
}

connect();
app.listen( 3000, (req, res) => {
	console.log("server is running on port 3000");
})