import { Product } from "../models";
import multer from "multer";
import path from "path";
import CustomErrorHandler from "../services/CustomErrorHandler";
import Joi from "joi";
import fs from "fs";
import productSchema from "../validators/product";

const productController = {
  
  async store(req, resp, next) {
    const { error } = productSchema.validate(req.body);
    // if (error) {
      
    //   return next(error);
    // }
    const { name, description, price, discount, category } =req.body;
    let document;

    try {
      document = await Product.create({
        name,
        description,
        price,
        discount,
        category,
      });
    } catch (err) {
     
      return next(err);
    }

    resp.status(201).json(document);
  },

  async update(req, resp, next) {
    const { error } = productSchema.validate(req.body);

    // if (error) {
    //   return next(error);
    // }

    const { name, description, price, discount, category } = req.body;
    let document;

    try {
      document = await Product.findOneAndUpdate(
        { _id: req.params.id },
        {
          name,
          description,
          price,
          discount,
          category,
        },
        // { new: true },
        {runValidators: true}
       
      );
    } catch (err) {
      return next(err);
    }

    resp.status(201).json(document);
  },

  async destroy(req, resp, next) {
    const document = await Product.findOneAndRemove({ _id: req.params.id });

    if (!document) {
      return next(new Error("Nothing to delete"));
    }

    //image delete

    //const imagePath = document._doc.image;

    //const imagePath = document.image;

    // fs.unlink(`${appRoot}/${imagePath}`, (err) => {
    //   if (err) {
    //     return next(CustomErrorHandler.serverError());
    //   }
    // });

    resp.json({
      status: "success",
      msg: "Product deleted successfully",
      document,
    });
  },

  async index(req, resp, next) {
    let documents;

    try {
      // let {page} = req.query;
      // let limit = 10;
      // if(!page) page = 1;
      
      // const skip = (page-1) * 10;

      let {page,limit} = req.query;
      if(!page) page = 1;
      if(!limit) limit = 2;
      const skip = (page-1) * limit;
    
      documents = await Product.find().skip(skip).limit(limit)
        .select("-updatedAt -__v")
        .sort({ _id: -1 });

      if (!documents[0]) {
        return next(new Error("Nothing to show"));
      }
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }

    resp.status(200).json({ status: "success", msg: "list of all products", documents });
  },

  async show(req, resp, next) {
    let document;

    try {
      document = await Product.findOne({ _id: req.params.id }).select(
        "-updatedAt -__v"
      );

      if (!document) {
        return next(new Error("No Data found for this id"));
      }
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }

    resp.json(document);
  },

  async search(req, resp, next) {
    console.log(req.query);
    let data;
    try {
      data = await Product.find({
        $or: [
          { name: { $regex: req.params.key, $options: "$i" } },
          { category: { $regex: req.params.key, $options: "$i" } },
          { discount: { $regex: req.params.key } },
          { price: { $lt: 100, $gt: 200 } },
        ],
      });
    } catch (err) {
      return next(err);
    }

    return resp.json(data);
  },

  async productName(req, resp, next) {
    let data;
    try {
      data = await Product.find({
      name: { $regex: req.query.name, $options: "$i" } ,
      });
    } catch (err) {
      return next(err);
    }

    return resp.json(data);
  },

  async productCategory(req, resp, next) {
    let data;
    try {
      data = await Product.find(
        // {
        //  category: { $regex: req.query.category, $options: "$i" } ,
        // }
        {
          category: new RegExp(req.query.category, "i"),
        },
        { updatedAt: 0, __v: 0 }
      ).sort({ _id: -1 });

      if(!data[0]){
        return resp.json({msg: "Nothing to show"})
      }
    } catch (err) {
      return next(err);
    }

    return resp.json(data);
  },

  async productDiscount(req, resp, next) {
 
    let data;
    try {
      data = await Product.find({
            discount: { "$gt": 10},
      });
      
      if(!data[0]){
       
        return resp.status(400).json({msg:"No data found"})
      }
    } catch (err) {
      return next(err);
    }

    return resp.json(data);
  },

  async productdiscountprice(req, resp, next) {
    let data;
    try {
      data = await Product.find({
        $and: [{ price: { $gt: 100 } }, { discount: { $gt: 20 } }],
      });

      if(!data[0]){
       
        return resp.status(400).json({msg:"No data found"})
      }

    } catch (err) {
      return next(err);
    }

    return resp.json(data);
  },

  async producttprice(req, resp, next) {
    let data;
    try {
      data = await Product.find({
        $or:[{price:{$lt:100}},{price:{$gt:200}}]
        
      });
    } catch (err) {
      return next(err);
    }

    return resp.json(data);
  },

  async updateAll(req, resp, next){
    let data;
    try{
        data = await Product.updateMany({ price: { $lte: 400 } },{ $inc: { price : 200 } })
    }
    catch(err){
        return next(err)
    }

    return resp.json(data)
  },

  async cheapProduct(req,resp,next){
    let product;

    try{
      product = await Product.find({price: {$lt:600}}).limit(5)

      if(!product[0]){
        return resp.json("No product found")
      }
    }
    catch(err){
      return next(err)
    }

    return resp.json(product)
  }

};

export default productController;
