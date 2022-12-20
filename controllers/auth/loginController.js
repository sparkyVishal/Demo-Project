import Joi from "joi";
import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import bcrypt from 'bcrypt';
import JwtService from '../../services/JwtService';
import { REFRESH_SECRET } from "../../config";

const loginController = {
    async login(req,resp,next){

        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        });

        const {error} = loginSchema.validate(req.body);

        if(error){
            return next(error);
        }

        try{
            const user = await User.findOne({email: req.body.email})

            if(!user){
                return next(CustomErrorHandler.wrongCrediantals())
            }
            const match = await bcrypt.compare(req.body.password, user.password) 
            if(!match){
                return next(CustomErrorHandler.wrongCrediantals())
            }

            //token
            const access_token =  JwtService.sign({_id: user._id , role: user.role});
            const refresh_token =  JwtService.sign({_id: user._id , role: user.role}, '1y', REFRESH_SECRET);
            await RefreshToken.create({token:refresh_token })

            resp.json({access_token: access_token, refresh_token:refresh_token})

        } catch(err){
            return next(err)
        }
    },

    async logout(req,resp,next){

        const logoutSchema = Joi.object({
            refresh_token: Joi.string().required(),
            
        });

        const {error} = logoutSchema.validate(req.body);

        if(error){
            return next(error)
        }

        try{
           // await RefreshToken.deleteOne({token: req.body.refresh_token})

           const find = await RefreshToken.findOneAndDelete({token: req.body.refresh_token})

           if(!find){
            return next(new Error("Token not found"));
           }
          
        }
        catch(err){
            return next(err)
        }

        resp.status(200).json({"status": "success", "msg": "Token deleted"})
    }
}

export default loginController;