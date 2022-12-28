import { Task } from "../models";

const taskController = {
    async add(req, resp, next){

        const {user} = req

        // console.log(user);
        
        const{title, description, task_type} = req.body;

        if(title && description && task_type){
            
            let document;

            try{
                document = await Task.create({
                    title,
                    description,
                    task_type,
                    created_by: user._id
                })
            }
            catch(err){
                return next(err)
            }
      
            resp.status(201).json({"msg": "task created" , document})

        }
        else{
             resp.status(400).json({"msg":"please fill all details"})
        }

    },

    async show_task(req, resp, next){
        try{
            const {user} = req

            const details = await Task.find({$or:[{created_by:req.params.id},{task_type:'public'}]}).select('-updatedAt -__v  -createdAt')
            
            if(!details){
                resp.status(400).json({"status":"fail", "msg": "no found task for this user"})
            }

           
            return resp.json(details)
        }
        catch(err){
            return next(err)
        }
    }
}



export default taskController;