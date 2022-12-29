import { Product } from "../models";
import multer from "multer";
import path from 'path';
import CustomErrorHandler from "../services/CustomErrorHandler";
import Joi from "joi";
import fs from 'fs';
import productSchema from "../validators/product";

const productController = {
    async store(req, resp, next) {
        const { error } = productSchema.validate(req.body);
        if (error) {

            return next(error)
        }
        const { name, description, price, offer_price, discount, category } = req.body;
        let document;

        try {
            document = await Product.create({
                name,
                description,
                price,
                offer_price,
                discount,
                category,

            })
        }
        catch (err) {
            return next(err)
        }

        resp.status(201).json(document)

    },


    async update(req, resp, next) {

        const { error } = productSchema.validate(req.body);

        if (error) {

            return next(error)
        }

        const { name, description, price, offer_price, discount, category } = req.body;
        let document;

        try {
            document = await Product.findOneAndUpdate({ _id: req.params.id }, {
                name,
                description,
                price,
                offer_price,
                discount,
                category,
               
            }, { new: true });
        }
        catch (err) {
            return next(err)
        }

        resp.status(201).json(document)


    },

    async destroy(req, resp, next) {
        const document = await Product.findOneAndRemove({ _id: req.params.id });

        if (!document) {
            return next(new Error("Nothing to delete"))
        }

        //image delete

        const imagePath = document._doc.image;

        //const imagePath = document.image;

        fs.unlink(`${appRoot}/${imagePath}`, (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError())
            }
        });

        resp.json({ "status": "success", "msg": "Product deleted successfully", document })
    },

    async index(req, resp, next) {
        let documents;

        try {
            documents = await Product.find().select('-updatedAt -__v').sort({ _id: -1 });

            if (!documents[0]) {
                return next(new Error("Nothing to show"))
            }
        }
        catch (err) {
            return next(CustomErrorHandler.serverError())
        }

        resp.status(200).json({ "status": "success", "msg": "list of all products", documents })
    },

    async show(req, resp, next) {
        let document;

        try {
            document = await Product.findOne({ _id: req.params.id }).select('-updatedAt -__v')

            if (!document) {
                return next(new Error("No Data found for this id"))
            }
        } catch (err) {
            return next(CustomErrorHandler.serverError())
        }

        resp.json(document)
    },

    async search(req, resp, next) {
        let data;
        try {
            data = await Product.find(
                {
                    "$or": [
                        { name: { $regex: req.params.key, $options: '$i' } },
                        { category: { $regex: req.params.key, $options: '$i' } },
                        { discount: { $regex: req.params.key } },
                        { price: { "$lt": 100 } },
                        
                    ]
          
                })
        }
        catch (err) {
            return next(err)
        }

        return resp.json(data)
    },

    async price_filter(req, resp, next){
        let data;
        try{
            data = await Product.find(
                {
                    $and: [{
                         price: { "$gt": 100 },
                    }, {
                        discount: { "$lt": 20 },
                    }]
          
                })

        }
        catch(err){
            return next(err)
        }
        console.log(data)
        return resp.json(data)
    }
}

export default productController;