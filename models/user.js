import mongoose from "mongoose";
import { APP_URL } from "../config";
import validator from "validator";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: [true, "name field is required"] },
    email: { type: String, requird: [true, "email is required"], unique: true, lowercase: true },
    password: { type: String, requird: [true, "password is required"], select:false},
    role: { type: String, default: "admin" },
    mobile: { type: Number, requird: [true, "mobile field is required"], unique: true , 
        validate: {
            validator: function (v) {
              return /^[0-9]{10}/.test(v);
            },
            message: '{VALUE} is not a valid 10 digit number!'
        }
    },
    profile_pic: {
      type: String,
      get: (profile_pic) => {
        return `${APP_URL}/${profile_pic}`;
      },
    },
  },
  { timestamps: true, toJSON: { getters: true }, id: false }
);

// userSchema.pre(/^find/, function (next) {
//     this.find().select(['-password', '-__v', '-createdAt', '-updatedAt'])
//     next()
// })

// userSchema.pre('aggregate', function(next){
//     this.pipeline().forEach((el)=>{ return el.select('-password')})
//     console.log(this.pipeline());
//     next()
//  })

// userSchema.pre('aggregate', function (next) {

//     next()
// })

// userSchema.post('find', function(doc,next){
//     next()
// })

export default mongoose.model("User", userSchema, "users");
