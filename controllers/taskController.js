import { User } from "../models";

const taskController = {
    async store(req, resp,next){
        let user;
        try{

            user = await User.find({_id: req.user._id}).select('-updatedAt -__v');
            
        }
        catch (err){
            return next(err)
        }
        resp.json(user);
    }
}

export default taskController;