const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
	name : String,
	ID : Number,
	role : {
		type : String,
		enum : ["supervisor", "admin"]
	},
	password : {
		type : String,
		required : true
	},
	airport : String
})

const User = mongoose.model("User", UserSchema, "users");

const FlightSchema = mongoose.Schema({
	flight_number : { type : Number},
	source : { type : String},
	departure : { type : String},
	destination : { type : String},
	arrival : { type : String},
	airline : { type : String},
	halt_station : { type : String},
	halt_time : { type : String},
	duration : { type : String},
	delay_time : { type : String}
})

const Flight = mongoose.model("Flight", FlightSchema);

module.exports = { User , Flight};