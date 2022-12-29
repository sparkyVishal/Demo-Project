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
            
            let details;

            if(req.params.type === 'all'){

                 details = await Task.find({$or:[{created_by:req.params.id},{task_type:'public'}]}).select('-updatedAt -__v  -createdAt')
            }
            else if(req.params.type === 'public'){
                 details = await Task.find({$or:[{created_by:req.params.id},{task_type:'public'}]}).select('-updatedAt -__v  -createdAt ').where('task_type', 'public')
            }
            else if(req.params.type === 'private'){
                details = await Task.find({$and:[{created_by:req.params.id},{task_type:'private'}]}).select('-updatedAt -__v  -createdAt ')
            }
           
            if(!details){
                resp.status(400).json({"status":"fail", "msg": "no found task for this user"})
            }


            return resp.json(details)
        }
        catch(err){
            return next(err)
        }
    },

    async search(req, resp, next){
    let data;
      try{
         data = await Task.find({
            "$or": [
                {title: {$regex: req.params.key, $options: '$i'}}
            ]
         }).select('-updatedAt -__v').sort({_id: -1});
      }
      catch(err){
        return next(err)
      }

      resp.json(data)
    }
}



export default taskController;