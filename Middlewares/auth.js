import CustomErrorHandler from "../Services/CustomErrorHandler";

const auth = (req, res, next) => {
    //getting authorization header from request header 
    let authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader) {
        return next(CustomErrorHandler.unAuthorized());
    }

    //split kya karta hai kii ye split krr deta hai jo hum dete hai humne space dii mean 
    //ye space se split karke ek array bna deta hai 
    const token = authHeader.split(' ')[1];
    console.log(token);


}
export default auth;