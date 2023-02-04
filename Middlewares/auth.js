import CustomErrorHandler from "../Services/CustomErrorHandler";
import JwtService from "../Services/JwtService";

const auth = async (req, res, next) => {
    //getting authorization header from request header 
    let authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(CustomErrorHandler.unAuthorized());
    }
    const token = authHeader.split(' ')[1];

    //to verify token
    try {
        //destructuring id and role from payload 
        const { _id, role } = await JwtService.verify(token);
        /* way 1
        req.user = {}; 
        req.user._id = _id;
        req.user.role = role;
        */
        //way 2
        const user = {
            _id: _id,
            role: role
        }
        //attach krr diya user object ko current object prr joki req hai  
        req.user = user;
        next();
    } catch (error) {
        return next(CustomErrorHandler.unAuthorized());
    }

}
export default auth;