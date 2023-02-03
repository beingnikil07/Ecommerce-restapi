import Joi from "joi";    //importing joi library for validate user data  
import { User } from '../../Models';
import bcrypt from 'bcrypt';
import JwtService from '../../Services/JwtService';
import CustomErrorHandler from '../../Services/CustomErrorHandler';


const registerController = {
    async register(req, res, next) {
        // Validation
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(25).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp(`^[a-zA-Z0-9]{3,30}$`)).required(),
            repeat_password: Joi.ref('password')
        })

        const { error } = registerSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        //Check if user is in the database already
        try {
            const exist = await User.exists({ email: req.body.email });
            if (exist) {
                return next(CustomErrorHandler.alreadyExist("Email is already exist"));
            }
        } catch (error) {
            return next(error);
        }

        //Hash Password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        //Prepare the model 
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })

        let access_token;
        try {
            const result = await user.save();
            console.log(result);
            access_token = JwtService.sign({ _id: result._id, role: result.role })

        } catch (error) {
            return next(error);
        }

        res.json({ access_token: access_token });
    }
}
export default registerController;