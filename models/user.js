import mongoose  from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {type: String, requird: true},
    email : {type: String, requird: true, unique: true},
    password : {type: String, requird: true},
    role : {type: String, default: 'admin'},
    profile_pic: {type: String },
    mobile : {type: Number, requird: true, unique: true},

}, {timestamps: true});

export default mongoose.model('User', userSchema, "users")