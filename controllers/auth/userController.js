import { Task, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import Joi from "joi";
import nodemailer from 'nodemailer';
import fast2sms from 'fast-two-sms'

const userController = {
    async user_details(req, resp, next) {
        try {
            const user = await User.findOne({ _id: req.user._id }).select(
                "-updatedAt -__v"
            );

            if (!user) {
                return next(CustomErrorHandler.notFound());
            }

            resp.json(user);
        } catch (err) {
            return next(err);
        }
    },

    async updateUser(req, resp, next) {
        let document
        try {
            const {user} = req;
            if ({user}) { 
                const { name, email, mobile } = req.body;
    
                 document = await User.findOneAndUpdate(
                    { _id: user._id },
                    {
                        name,
                        email,
                        mobile,
    
                    },
                    // { new: true }
                    {runValidators: true}
                );

                return resp.json(document);
                
            }
            
            }

        catch (err) {
            return next(err);
        }
    
    },

    async deleteUser(req,resp,next){
        try{
            const {user} = req;
            const data = await User.findOneAndDelete({_id: user._id})
            
            if(data){
                const taskDelete = await Task.deleteMany({created_by:user._id})
                console.log(taskDelete);
            }
            return resp.status(200).json({msg:"user deleted", user})
        }
        catch(err){
            return next(err)
        }
    },

    async searchUser(req,resp,next){
        try{
            const data = await User.find(
                {
                    name: new RegExp(req.query.name, "i"),
                },
                { updatedAt: 0, __v: 0 }
                ).sort({ _id: -1 })

            return resp.json(data)
                
        }
        catch(err){
            return next(err)
        }
    },

    async sendMail(req,resp,next){
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'vishal.sharma@pairroxz.in',
                pass: "YaJ7kD9PdQwC2G1wSH"
            }
        })

        let mailOptions = {
            from : 'la12x@tqest.com',
            to: 'vishal.sharma@pairroxz.in',
            subject: 'demo mail',
            text: 'Hello user'
        }

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            }
            else{
                console.log("email is sent", info.response);
            }
        })
    },

    async sendOtp(req,resp,next){
        console.log("hii");
        let options =
        {
            authorization:'tmHdGaCpxAyofrXDVB5bEIwWi7ZnS2Oqu6jFcPkNsLhQKU4z1vohpFgEnOMlabxNILDf60HGc9X7VBRW',
            message: "This is your otp 5678",
            numbers: ['8385015524']
        }

        fast2sms.sendMessage(options)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            })
    }
};

export default userController;
