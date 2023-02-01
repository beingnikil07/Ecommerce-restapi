import { DEBUG_MODE } from '../config/index.js';
import { ValidationError } from 'joi';

const errorHandler = (err, req, res, next) => {
    //defining default status code for error 
    let statusCode = 500;
    //Jvv bhi hum client ko error send karte hai to hum client ko status code
    //aur error message send karte hai jisse user ko error ka pta chal paaye
    //Ye hum by default kuch error user ko send krr rhe hai ek object data mai 
    //jisse user easily samajh paaye error ko
    let data = {
        message: "Internal server error",
        ...(DEBUG_MODE === 'true' && { originalError: err.message })
    }

    //ye keyword humko batayega kii ye jo object humko receive ho rha hai
    //wo kis class ka ya phir kis function ka instance hai 
    //ye joi kii ek class hai jo validation error ko batati hai
    //yha hum check krr rhe hai kii ye jo err hai ye ValidationError class
    //ka instance hai kya  
    if (err instanceof ValidationError) {
        statusCode = 422;
        data = {
            message: err.message
        }
    }

    return res.status(statusCode).json(data);
}
export default errorHandler;