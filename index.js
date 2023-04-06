const express = require("express");
const app = express();
const mongoose = require("mongoose");
const {User, Flight}=require('./db');
require("dotenv").config();

async function connect(){
	try {
			await mongoose.connect(process.env.MONGO_URI);
			console.log("connected to MongoDB");
	}
	catch(error) {
			console.log(error);
	}
}

app.post("/login", async (req, res) => {
	try{
	let user = await User.findOne({ ID : req.body.id , role: req.body.role});
	if(req.body.password === user.password)
	return res.send("login successful!");
	else return res.status(400).send("Invalid credentials");
	}
	catch(err){
		return res.send(err)
	}
})

app.post("/register-supervisor", async (req, res)=> {
	try {
		let id = Math.floor( Math.random())*1000;
		let response = await User.create({ password : req.body.password , ID : id, role : "supervisor"});
		return res.send("supervisor created", response);
	} catch (error) {
		return res.send(error);
	}
})

app.get("/flight-details" , async (req, res) => {
	let data = await Flight.find({});
	return res.send({data});
})

app.post("/add-flight-details", async (req,res) => {

	const { 
	flight_number ,
	source,
	departure ,
	destination,
	arrival ,
	airline ,
	halt_station ,
	halt_time ,
	duration ,
	delay_time 
	} = req.body;

	let response = await Flight.create({
		flight_number ,
		source,
		departure ,
		destination,
		arrival ,
		airline ,
		halt_station ,
		halt_time ,
		duration ,
		delay_time 
	});
	return res.send("flight details added ", response);
})

app.post("/edit-flight", async (req,res) => {
	try {
		const { 
			flight_number ,
			source,
			departure ,
			destination,
			arrival ,
			airline ,
			halt_station ,
			halt_time ,
			duration ,
			delay_time 
			} = req.body;

			let fl = await Flight.updateOne({ flight_number} , { $set : {
			source,
			departure ,
			destination,
			arrival ,
			airline ,
			halt_station ,
			halt_time ,
			duration ,
			delay_time 
			}});

			if(fl)
			return res.send("flight details updated");
	} catch (error) {
		return res.send(error);
	}
})

connect();
app.listen( 3000, (req, res) => {
	console.log("server is running on port 3000");
})