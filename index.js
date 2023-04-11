const express=require("express");
const app=express();
const mongoose=require("mongoose");
const {User,Flight}=require('./db');
require("dotenv").config();
const cors=require("cors");

app.use(cors());
app.use(express.json())

async function connect() {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("connected to MongoDB");
	}
	catch(error) {
		console.log(error);
	}
}

app.post("/login",async (req,res) => {
		const { id, password} = req.body;
		let user=await User.findOne({ID: id,role: req.body.role});
		if(!user) return res.status(400).send("Invalid credentials");
		if(password===user.password)
			return res.status(200).send("login successful!");
		else return res.status(400).send("Invalid credentials");
})

app.post("/register-supervisor",async (req,res) => {
	try {
		let id=Math.floor(Math.random() * 1000) + 1000;
		let response=await User.create({password: req.body.password,ID: id,role: "supervisor"});
		console.log(response);
		return res.status(200).send({response});
	} catch(error) {
		return res.send(error);
	}
})
app.post("/get-by-airport", async (req, res) => {
	try {
		const {destination, airlines} = req.body;
		let response = (await Flight.find({ destination, airlines}));
		if(response) return res.status(200).send(response);
		else return res.status(400).send("error");
	} catch (error) {
		return res.send(error);
	}
})
app.get("/flight-details",async (req,res) => {
	let data= (await Flight.find({}))
	return res.status(200).send(data);
})

app.post("/get-flight-by-number", async (req, res) => {
	try {
		let data = await Flight.findOne({ flight_number : req.body.flight_number});
		if(data)
			return res.status(200).send({data});
		else 
			return res.status(400).send("flight details not found !")
	} catch (error) {
		console.log(error);
	}
})

app.post("/add-flight-details",async (req,res) => {

	const {
		flight_number,
		source,
		departure,
		destination,
		arrival,
		airlines,
		halt_station,
		halt_time,
		duration,
		delay_time
	}=req.body;

	let fl = await Flight.findOne({ flight_number});
	if(!fl){
	let response=await Flight.create({
		flight_number,
		source,
		departure,
		destination,
		arrival,
		airlines,
		halt_station,
		halt_time,
		duration,
		delay_time
	});
	return res.status(200).send(response);
	}
	return res.sendStatus(400);
})

app.post("/edit-flight",async (req,res) => {
	try {
		const {
			flight_number,
			source,
			departure,
			destination,
			arrival,
			airline,
			halt_station,
			halt_time,
			duration,
			delay_time
		}=req.body;

		let fl=await Flight.updateOne({flight_number},{
			$set: {
				source,
				departure,
				destination,
				arrival,
				airline,
				halt_station,
				halt_time,
				duration,
				delay_time
			}
		});

		if(fl)
			return res.status(200).send("flight details updated");
	} catch(error) {
		return res.send(error);
	}
})

connect();
app.listen(3001,(req,res) => {
	console.log("server is running on port 3000");
})