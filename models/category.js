import mongoose from "mongoose";

import { APP_URL } from "../config";

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    cat_name : {type: String, required: true, unique: true},
    price : {type: Number, required: true},
    category_image : {type: String, required: true,  get: (category_image) => {

        return `${APP_URL}/${category_image}`;
    }},

}, {timestamps: true, toJSON:{ getters:true }, id: false});

export default mongoose.model('Category', categorySchema, "categories")