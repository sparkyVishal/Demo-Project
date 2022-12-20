import Joi from 'joi';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import {RefreshToken, User} from '../../models';
import bcrypt from 'bcrypt';
import JwtService from '../../services/JwtService';
import { REFRESH_SECRET } from '../../config';
import multer from "multer";
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination : (req,file,cb) => cb(null, 'profile_pic/'),
    filename: (req,file,cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});
const handleMultipartData = multer({storage, limits: { fileSize: 1000000 * 5 }}).single('profile_pic') 

const registerController = {
    async register(req,resp,next){

        handleMultipartData(req, resp, async (err) => {
            if(err){
                return next(CustomErrorHandler.serverError(err.message))
            }

            let filePath;
            if(req.file){

                 filePath = req.file.path;
            }
            else{
                filePath = '';
            }

            const registerSchema = Joi.object({
                name: Joi.string().min(3).max(30).required(),
                email: Joi.string().email().required(),
                password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
                repeat_password: Joi.ref('password'),
                mobile: Joi.number().min(10).required(),
            });
    
            const {error} = registerSchema.validate(req.body);
    
            if(error){

                fs.unlink(`${appRoot2}/${filePath}`, (err) => {
                    if(err){

                        return next(CustomErrorHandler.serverError(err.message))
                    }
                });

                return next(error)
            }
            //check user is already exists or not
    
            try{
                const exist = await User.exists({email: req.body.email});
    
                if(exist){
                    return next(CustomErrorHandler.alreadyExist("This email is already taken"))
                }
            }
            catch(err){
                return next(err);
            }

            //mobile no is already exist

            try{
                const mobile = await User.exists({mobile: req.body.mobile})
                if(mobile){
                    return next(CustomErrorHandler.mobileExists())
                }
            }
            catch(err){
                return next(err);
            }
            const {name, email, password, mobile} = req.body;
    
    
            const hashPassword = await bcrypt.hash(password , 10);
    
            const user = new User({
                name,
                email,
                password: hashPassword,
                profile_pic: filePath,
                mobile,
            })

            let access_token;
            let refresh_token;
            let result;

            try{
                result = await user.save();
            
                //token
                access_token =  JwtService.sign({_id: result._id , role: result.role});
                refresh_token =  JwtService.sign({_id: result._id , role: result.role}, '1y', REFRESH_SECRET);
    
                await RefreshToken.create({token:refresh_token })
    
            }
            catch (err){
                return next(err);
            }
            resp.json({access_token, refresh_token, result})
        })

    }
}

export default registerController;