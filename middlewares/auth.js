import { User } from "../models";
import CustomErrorHandler from "../services/CustomErrorHandler";
import JwtService from "../services/JwtService";

const auth = async (req,resp,next) => {
    let authHeader = req.headers.authorization ;

    if(!authHeader){
        return next(CustomErrorHandler.unAuthorized())
    }

    const token = authHeader.split(' ')[1];

    //token verify for correct is or not
    try{
        const{_id, role} = await JwtService.verify(token);

        const user = {
            _id,
            role
        }

        req.user = user;
        next();

    } catch(err){
        return next(CustomErrorHandler.unAuthorized())
    }
}

export default auth;