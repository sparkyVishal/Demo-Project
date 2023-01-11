import { Blog } from "../models";

const blogController = {
    async show(req,resp,next) {
        let blogs;
        try{
            blogs = await Blog.find();
            if(!blogs[0]){
                return resp.status(400).json({msg: "Nothing to show"})
            }
    
           
        }
        catch(err){
            return next(err)
        }

        return resp.status(200).json(blogs)
    
    },

    async add(req,resp,next){
        const{title,description,user} = req.body;

        try{
            if(title && description && user){

                const blog = new Blog({
                    title,
                    description,
                    user
                });

                const result = await blog.save();

                resp.status(200).json({msg: "success", result})
    
            }
            else{
                resp.json({msg:"All fields are required"})
            }
        }
        catch(err){

        }

    },

    async update(req,resp,next){
        const{title,description,user} = req.body;

        let document;

        try{
            document = await Blog.findOneAndUpdate({_id: req.params.id },
                {
                    title,
                    description,
                    user
                  },
                  { new: true }
                
            )
        }
        catch(err){
            return next(err)
        }

        resp.status(201).json(document);
    }
}

export default blogController;