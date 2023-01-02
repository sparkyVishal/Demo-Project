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
        let details;
        let task_type = 'public';
        try{
            const {user,query} = req;

            const {type} = query


            let queryToApply = {}

            if(type==='all'){
                query = {
                    
                }
            }
           
            if(req.query.type === 'all'){
                 details = await Task.find({$or:[{created_by:user._id},{task_type: task_type}]}, {'updatedAt':0, '__v':0})
            }
            else if(req.query.type === 'public'){
                 details = await Task.find({$or:[{created_by:user._id},{task_type: task_type}]}, {'updatedAt':0, '__v':0}).where('task_type', 'public')
            }
            else if(req.query.type === 'private'){
                details = await Task.find({$and:[{created_by:user._id},{task_type:'private'}]}, {'updatedAt':0, '__v':0})
            }

            else{
                details = await Task.find({
                title:new RegExp(req.query.title,'i')}, {'updatedAt':0, '__v':0}).sort({_id: -1})
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
    console.log('req.params.key',req.params.key);
      try{
        //  data = await Task.find({
        //     title:new RegExp(req.params.key,'i')
        //  }).select('-updatedAt -__v').sort({_id: -1});

        data = await Task.find({
            title:new RegExp(req.params.key,'i')}, {'updatedAt':0, '__v':0}).sort({_id: -1})
      }
      catch(err){
        return next(err)
      }

      resp.json(data)
    }
}



export default taskController;