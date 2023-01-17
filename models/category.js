import mongoose from "mongoose";

import { APP_URL } from "../config";

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    cat_name : {type: String, required: [true, "category name field is required"], unique: [true, "This category name is taken"]},
    price : {type: Number, required: [true, "price field is required"]},
    category_image : {type: String, required: [true, "image field is required"],  get: (category_image) => {

        return `${APP_URL}/${category_image}`;
    }},

}, {timestamps: true, toJSON:{ getters:true }, id: false});

export default mongoose.model('Category', categorySchema, "categories")