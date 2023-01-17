// error handle middleware
import {DEBUG_MODE} from '../config';
import {ValidationError} from 'joi';
import CustomErrorHandler from '../services/CustomErrorHandler';

const errorHandler = (err, req, resp ,next) => {
    let statusCode = 400;
    let data = {
        // message: "Internal Server Error",
        message: "Validation Error",

        ...(DEBUG_MODE === 'true' && {originalError : err.message})
    }
    
    // joi validation error show k liye
    if(err instanceof ValidationError){
        statusCode = 422;
        data = {
            message: err.message
        }
    }

    //same email
    if(err instanceof CustomErrorHandler){
        statusCode = err.status;
        data = {
            message: err.message
        }
    }

    return resp.status(statusCode).json(data);
}


export default errorHandler