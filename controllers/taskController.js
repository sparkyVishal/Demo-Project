import { Task } from "../models";
import { User } from "../models";

const taskController = {
  async add(req, resp, next) {
    const { user } = req;

    const { title, description, task_type } = req.body;

    let document;

    try {
      document = await Task.create({
        title,
        description,
        task_type,
        created_by: user._id,
      });
      resp.status(201).json({ msg: "task created", document });
    } catch (err) {
      return next(err);
    }
  },

  async show_task(req, resp, next) {
    let details;
    let task_type = "public";
    try {
      const { user, query } = req;

      const { type } = query;

      let queryToApply = {};

      if (type === "all") {
        query = {};
      }

      if (req.query.type === "all") {
        details = await Task.find(
          { $or: [{ created_by: user._id }, { task_type: task_type }] },
          { updatedAt: 0, __v: 0 }
        );
      } else if (req.query.type === "public") {
        details = await Task.find(
          { $or: [{ created_by: user._id }, { task_type: task_type }] },
          { updatedAt: 0, __v: 0 }
        ).where("task_type", "public");
      } else if (req.query.type === "private") {
        details = await Task.find(
          { $and: [{ created_by: user._id }, { task_type: "private" }] },
          { updatedAt: 0, __v: 0 }
        );
      } else {
        details = await Task.find(
          {
            title: new RegExp(req.query.title, "i"),
          },
          { updatedAt: 0, __v: 0 }
        ).sort({ _id: -1 });
      }

      if (!details) {
        resp
          .status(400)
          .json({ status: "fail", msg: "no found task for this user" });
      }

      return resp.json(details);
    } catch (err) {
      return next(err);
    }
  },

  async search(req, resp, next) {
    let data;
    // console.log("req.params.key", req.params.key);
    try {
      data = await Task.find(
        {
          title: new RegExp(req.params.key, "i"),
        },
        { updatedAt: 0, __v: 0 }
      )
        .sort({ _id: -1 })
        .limit(3);
    } catch (err) {
      return next(err);
    }

    resp.json(data);
  },

  async deleteTask(req, resp, next) {
    const { user } = req;

    if (!user) {
      return next(new Error("You are not authorized to delete task"));
    }

    const data = await Task.findOneAndDelete({
      $and: [{ created_by: user._id }, { _id: req.params.id }],
    });

    if (!data) {
      return resp.status(400).json("Task not found");
    }

    return resp.json({ msg: "successfully task deleted", data });
  },

  async modify(req, resp, next) {
    let data;
    try {
      data = await Task.updateMany(
        { task_type: "PRIVATE" },
        { $set: { stat: "private", result: "demo" } },
        { new: true }
      );
    } catch (err) {
      return resp.json(err);
    }

    return resp.json(data);
  },

  async removeKey(req, resp, next) {
    let data;
    try {
      data = await Task.updateMany({ title: "hloo" }, { $unset: { stat: 1 } });
    } catch (err) {
      return next(err);
    }

    return resp.json(data);
  },

  async showUserTaskInfo(req,resp,next){
    let data
    try{
      data  = await User.aggregate([
        {
          $lookup: {
            from: "tasks",
            localField: "_id",
            foreignField: "created_by",
            as: "task_details",
          },
        
      } 
     ])
      return resp.json(data)
    }
    catch(err){
      return next(err)
    }
  },


  async showTaskUserInfo(req,resp,next){
    let data
    try{
      data  = await Task.aggregate([
         {$group:{_id : '$created_by'}},
        {
          $lookup: {
            from: "users",
            localField: "created_by",
            foreignField: "_id",
            as: "user_details",
          },  
      } ,

     ])
      return resp.json(data)
    }
    catch(err){
      return next(err)
    }
  },

  async addField(req,resp,next){
    let data
    try{
      data = await Task.updateMany({}, {$push:{"skills":["Sports","Music", "Singing"]}})
      
      return resp.json(data)
    }
    catch(err){
      return next(err)
    }
  
  },

  async userList(req,resp,next){
    // let data,map;
    try{
      // data = await User.find()
  //      map = {
  //       "$map": {
  //           "input": { "$split": [ "$name", " " ] },
  //           "as": "name",
  //           "in": {                                                                             
  //               "$concat": [
  //                   { "$toUpper": { "$substrCP": ["$$name", 0, 1] } }, 
  //                   {                                                           
  //                       "$substrCP": [
  //                           "$$name",
  //                           1,
  //                           { "$subtract": [{ "$strLenCP": "$$name" }, 1 ]}
  //                       ] 
  //                   }
  //               ]
  //           }
  //       }
  //   };

  //  data =  await User.aggregate([
  //       {
  //           "$addFields": {
  //               "name": {
  //                   "$concat": [
  //                       { "$arrayElemAt": [map, 0] }
                       
  //                   ]
  //               }
  //           }
  //       }
  //   ]);

  const data = await User.find()
  return resp.json(data)

    }
    catch(err){
      return next(err)
    }
    
  },

  async singleUser(req,resp,next){
    let user,userName;
    try{
      user = await User.findById({_id: req.params.id})

      if(!user){
        return next(new Error("No data found for this user id"))
      }

      userName = user.name;
      
    }
    catch(err){
      return next(err)
    }
    const capitalized = userName.charAt(0).toUpperCase()+ userName.slice(1)
    console.log(capitalized);
    return resp.json({user,capitalized})
  },


  async taskList(req,resp,next){
    try{
      const list = await Task.find().sort({ _id: -1 });

      const count = await Task.count()


      // const list = await Task.aggregate([{$match:{title : 'hloo'}}]).sort({ _id: -1 })

      // const list = await Task.aggregate([{$group:{_id : '$created_by'}}])

      //  const list = await Task.aggregate([{$match:{description : 'checkk'}}, {$count: "total count for this description is"}])


      // const list = await Task.aggregate([{$project:{pro : 'project'}}])
      
      return resp.json({count,list})
    }
    catch(err){
      return next(err)
    }
  },

  async singleTask(req,resp,next){
    try{
      const task = await Task.findOne({_id: req.params.id})
      return resp.json(task)
    }
    catch(err){
      return next(err)
    }
  }


};

export default taskController;
