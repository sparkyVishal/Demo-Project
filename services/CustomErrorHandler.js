class CustomErrorHandler extends Error{
    constructor(status,msg){
        super();
        this.status = status;
        this.message = msg;
    }

    static alreadyExist(message){
        return new CustomErrorHandler(409, message);
    }

    static mobileExists(message="This number is already taken"){
        return new CustomErrorHandler(409, message);
    }

    static wrongCrediantals(message = "Email or password is incorrect"){
        return new CustomErrorHandler(401, message);
    }

    static unAuthorized(message = "unAuthorized"){
        return new CustomErrorHandler(401, message);
    }
    
    static notFound(message = "404 not found"){
        return new CustomErrorHandler(404, message);
    }

    static serverError(message = "Internal Server Error"){
        return new CustomErrorHandler(500, message);
    }
}

export default CustomErrorHandler;