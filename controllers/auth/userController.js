import { Task, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import Joi from "joi";

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
    }
};

export default userController;
