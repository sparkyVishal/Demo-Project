import { Task } from "../models";

const taskController = {
    async add(req, resp, next){
        
        const{title, description, task_type, created_by} = req.body;

        if(title && description && task_type && created_by){

            let document;

            try{
                document = await Task.create({
                    title,
                    description,
                    task_type,
                    created_by
                })
            }
            catch(err){
                return next(err)
            }

            resp.status(201).json({"msg": "task created" , document})

        }
        else{
            resp.status(400).json("please fill all details")
        }

    },

    async show_task(req, resp, next){
        try{
            const details = await Task.find({created_by: req.params.id}).select('-updatedAt -__v -created_by -createdAt')

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