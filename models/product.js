import mongoose  from "mongoose";

import { APP_URL } from "../config";

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name : {type: String, required: [true, "name field is required"]},
    description: {type: String, required: true},
    price : {type: Number, required: true},
    offer_price : {type: Number, required: true},
    discount : {type: String, required: true},
    category : {type: String, required: true, enum: {values: ['Electronics', 'Beverages', 'Cosmetics', 'Food', 'Shoes'], message: 'category value must lie in between of Electronics or Beverages or Cosmetics or Food or Shoes'}},

    // image : {type: String, required: true,  get: (image) => {

    //     return `${APP_URL}/${image}`;
    // }},

// }, {timestamps: true, toJSON:{ getters:true }, id: false});
}, {timestamps: true});

export default mongoose.model('Product', productSchema, "products")