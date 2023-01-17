import { string } from "joi";
import mongoose from "mongoose";

import { APP_URL } from "../config";

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title : {type: String, required: [true, "title field is required"]},
    description : {type: String, required: [true, "description field is required"]},
    task_type : {type: String, required: true, enum: {values:['PUBLIC', 'PRIVATE'], message: 'type is either PUBLIC or PRIVATE'} },

    created_by : {type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User'},
    stat       :  {type: String},
    result: {type:String},
    
    skills: {type:String}
    
    
}, {timestamps: true, toJSON:{ getters:true }, id: false});

// taskSchema.pre('find', function(){
//     // console.log("before find", this);

//     this.find({title: {$ne: "hloo"}})
    
// })

// taskSchema.post('save', function(doc){
//     console.log("after save", doc);
//     this.title = undefined
// })

export default mongoose.model('Task', taskSchema, "tasks")