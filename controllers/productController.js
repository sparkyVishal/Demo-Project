import { Product } from "../models";
import multer from "multer";
import path from 'path';
import CustomErrorHandler from "../services/CustomErrorHandler";
import Joi from "joi";
import fs from 'fs';
import productSchema from "../validators/product";


const storage = multer.diskStorage({
    destination : (req,file,cb) => cb(null, 'uploads/'),
    filename: (req,file,cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const handleMultipartData = multer({storage, limits: { fileSize: 1000000 * 5 }}).single('image') // 5mb

const productController = {
    async store(req, resp, next) {

        //Multi part form data
        handleMultipartData(req, resp, async (err) => {
            if(err){
                return next(CustomErrorHandler.serverError(err.message))
            }

           // console.warn(req.file)
            const filePath = req.file.path;

            //validation

            const productSchema = Joi.object({
                name: Joi.string().required(),
                price: Joi.number().required(),
                size: Joi.string().required(), 
            });
            const { error } = productSchema.validate(req.body);
            
            if (error) {
                
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if(err){

                        return next(CustomErrorHandler.serverError(err.message))
                    }
                });

                return next(error)
            }

            const {name, price, size} = req.body;
            let document;

            try{
                document = await Product.create({
                    name,
                    price,
                    size,
                    image: filePath
                })
            }
            catch(err){
                return next(err)
            }

            resp.status(201).json(document)

        });
    },


    async update(req, resp, next){
        handleMultipartData(req, resp, async (err) => {
            if(err){
                return next(CustomErrorHandler.serverError(err.message))
            }

           let filePath;
            if(req.file){
                filePath = req.file.path;
            }
           
            //validation

            // const productSchema = Joi.object({
            //     name: Joi.string().required(),
            //     price: Joi.number().required(),
            //     size: Joi.string().required(), 
            // });
            const { error } = productSchema.validate(req.body);
            
            if (error) {
                
                if(req.file){
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if(err){
    
                            return next(CustomErrorHandler.serverError(err.message))
                        }
                    });
                }

                return next(error)
            }

            const {name, price, size} = req.body;
            let document;

            try{
                document = await Product.findOneAndUpdate({_id: req.params.id}, {
                    name,
                    price,
                    size,
                    ...(req.file && {image: filePath})
                }, {new: true});
            }
            catch(err){
                return next(err)
            }

            resp.status(201).json(document)

        });
    },

    async destroy(req, resp, next){
       const document = await Product.findOneAndRemove({_id: req.params.id});

       if(!document){
        return next(new Error("Nothing to delete"))
       }

       //image delete

        const imagePath = document._doc.image;

        //const imagePath = document.image;

        fs.unlink(`${appRoot}/${imagePath}`, (err) => {
            if(err){
                return next(CustomErrorHandler.serverError())
            }
        });

       resp.json({"status":"success", "msg": "Product deleted successfully", document})
    },

    async index(req, resp, next){
        let documents;

        try{
            documents = await Product.find().select('-updatedAt -__v').sort({_id: -1});

            if(!documents[0]){
                return next(new Error("Nothing to show"))
            }
        }
        catch(err){
            return next(CustomErrorHandler.serverError())
        }

        resp.status(200).json({"status":"success", "msg":"list of all products", documents})
    },

    async show(req,resp,next){
        let document;

        try{
            document = await Product.findOne({_id: req.params.id}).select('-updatedAt -__v')

            if(! document){
                return next(new Error("No Data found for this id"))
            }
        }catch(err){
            return next(CustomErrorHandler.serverError())
        }

        resp.json(document)
    }
}

export default productController;