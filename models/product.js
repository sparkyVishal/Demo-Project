import mongoose  from "mongoose";

import { APP_URL } from "../config";

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name : {type: String, required: true},
    description: {type: String, required: true},
    price : {type: Number, required: true},
    offer_price : {type: Number, required: true},
    discount : {type: String, required: true},
    category : {type: String, required: true, enum: ['Electronics', 'Beverages', 'Cosmetics', 'Food', 'Shoes']},
    // image : {type: String, required: true,  get: (image) => {

    //     return `${APP_URL}/${image}`;
    // }},

// }, {timestamps: true, toJSON:{ getters:true }, id: false});
}, {timestamps: true});

export default mongoose.model('Product', productSchema, "products")