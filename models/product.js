import mongoose  from "mongoose";

import { APP_URL } from "../config";

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name : {type: String, required: [true, "name field is required"], trim: true},
    description: {type: String, required: [true, "description field is required"], trim: true},
    price : {type: Number, required: [true, "price field is required"], trim: true},
    discount : {type: Number, required: [true, "discount is required"], trim: true},
    category : {type: String, required: true, enum: {values: ['Electronics', 'Beverages', 'Cosmetics', 'Food', 'Shoes'], message: 'category value must lie in between of Electronics or Beverages or Cosmetics or Food or Shoes'}},

    // image : {type: String, required: true,  get: (image) => {

    //     return `${APP_URL}/${image}`;
    // }},

// }, {timestamps: true, toJSON:{ getters:true }, id: false});
}, {timestamps: true});

export default mongoose.model('Product', productSchema, "products")