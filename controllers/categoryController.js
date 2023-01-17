import { Category } from "../models";
import multer from "multer";
import Joi from "joi";
import fs from 'fs';
import CustomErrorHandler from "../services/CustomErrorHandler";
import path from "path";

const storage = multer.diskStorage({
    destination : (req,file,cb) => cb(null, 'category/'),
    filename: (req,file,cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
            cb(null, uniqueName);
          } else {
            return cb(new Error('Only .png, .jpg and .jpeg format are allowed for category images!'));
          }
        
    }
});

const handleMultipartData = multer({storage, limits: { fileSize: 1000000 * 5 }}).single('category_image') 

const categoryController = {
    async add(req, resp, next){
        handleMultipartData(req, resp, async (err) => {
            if(err){
                return next(CustomErrorHandler.serverError(err.message))
            }

            let filePath = '';
            if(req.file){

                 filePath = req.file.path;
            }

            let document;
            
            try{
                const {cat_name, price} = req.body;
                const name_exist = await Category.findOne({cat_name: cat_name})

                if(cat_name == ''){
                    fs.unlink(`${catImage}/${filePath}`, (err) => {
                                if(err){
            
                                    return next(CustomErrorHandler.serverError(err.message))
                                }
                            });
                    resp.status(400).json({ "status": "failed", "msg": "Name field is required" })
                }

                else if(name_exist){
                    resp.status(400).json({ "status": "failed", "msg": "This category name is alreday taken" })
                }
                
                
                if(price == ''){
                    fs.unlink(`${catImage}/${filePath}`, (err) => {
                        if(err){
    
                            return next(CustomErrorHandler.serverError(err.message))
                        }
                    });
                    resp.status(400).json({ "status": "failed", "msg": "price field is required" })
                }

                document = await Category.create({
                    cat_name,
                    price,
                    category_image: filePath
                })
            } catch(err){
                return next(err)
            }

          resp.status(201).json({"status":"success", "msg": "category added", document})

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
            let document;
            
            try{
                const {cat_name, price} = req.body;
                if(cat_name == ''){
                    fs.unlink(`${catImage}/${filePath}`, (err) => {
                                if(err){
            
                                    return next(CustomErrorHandler.serverError(err.message))
                                }
                            });
                    resp.status(400).json({ "status": "failed", "msg": "Name field is required" })
                }

                if(price == ''){
                    fs.unlink(`${catImage}/${filePath}`, (err) => {
                        if(err){
    
                            return next(CustomErrorHandler.serverError(err.message))
                        }
                    });
                    resp.status(400).json({ "status": "failed", "msg": "price field is required" })
                }

                document = await Category.findOneAndUpdate({_id: req.params.id}, {

                    cat_name,
                    price,
                   
                    ...(req.file && {image: filePath})
                }, {runValidators: true})
            } catch(err){
                return next(err)
            }

            resp.status(201).json(document)


        })
    },

    async destroy(req, resp, next){
        const document = await Category.findOneAndRemove({_id: req.params.id});
 
        if(!document){
         return next(new Error("Nothing to delete"))
        }
 
        //image delete
 
         const imagePath = document._doc.image;
 
         //const imagePath = document.image;
 
         fs.unlink(`${catImage}/${imagePath}`, (err) => {
             if(err){
                 return next(CustomErrorHandler.serverError())
             }
         });
 
        resp.json({"status":"success", "msg": "cat deleted successfully", document})
     },


     async index(req, resp, next){
        let documents;

        try{
            documents = await Category.find().select('-updatedAt -__v').sort({_id: -1});

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
            document = await Category.findOne({_id: req.params.id}).select('-updatedAt -__v')

            if(! document){
                return next(new Error("No Data found for this id"))
            }
        }catch(err){
            return next(CustomErrorHandler.serverError())
        }

        resp.json(document)
    }

}

export default categoryController;