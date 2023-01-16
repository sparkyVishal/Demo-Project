import { string } from "joi";
import mongoose from "mongoose";

import { APP_URL } from "../config";

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title : {type: String, required: [true, "title field is required"]},
    description : {type: String, required: true},
    task_type : {type: String, required: true, enum: {values:['PUBLIC', 'PRIVATE'], message: 'type is either PUBLIC or PRIVATE'} },

    created_by : {type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User'},
    stat       :  {type: String},
    result: {type:String}
    
    
}, {timestamps: true, toJSON:{ getters:true }, id: false});

export default mongoose.model('Task', taskSchema, "tasks")