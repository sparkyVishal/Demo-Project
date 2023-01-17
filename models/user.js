import mongoose  from "mongoose";
import { APP_URL } from "../config";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {type: String, requird: true},
    email : {type: String, requird: true, unique: true, lowercase: true},
    password : {type: String, requird: true},
    role : {type: String, default: 'admin'},
    mobile : {type: Number, requird: true, unique: true},
    profile_pic: {type: String , get: (profile_pic) => {

        return `${APP_URL}/${profile_pic}`;
    }},

}, {timestamps: true, toJSON:{ getters:true }, id: false});

userSchema.pre(/^find/, function(next){
   this.find().select(['-password','-__v','-createdAt','-updatedAt'])
   next()
})

// userSchema.pre('aggregate', function(next){
//     this.pipeline().forEach((el)=>{ return el.select('-password')})
//     console.log(this.pipeline());
//     next()
//  })

// userSchema.post('find', function(doc,next){
//     next()
// })   

export default mongoose.model('User', userSchema, "users")