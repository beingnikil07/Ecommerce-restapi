import Joi from "joi";    //importing joi library for validate user data  
import { User } from '../../Models';
import bcrypt from 'bcrypt';
import JwtService from '../../Services/JwtService';


const registerController = {
    async register(req, res, next) {

        /**
         *  user register ke liye jvv vii request aayegi api se to hum kuch steps follow karenge 
         * 1.Validate the request 
         * 2.authorise the request 
         * 3.check-if user is in the database already
         * 4.prepare model
         * 5.store in database
         * 6.generate jwt token
         * 7.send response
         */

        // Validation
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(25).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp(`^[a-zA-Z0-9]{3,30}$`)).required(),
            repeat_password: Joi.ref('password')
        })

        //schema prr validation lga diya aur pass krr denge body of api 
        //Jo bhi api kii body se milega ye uspar validation lagayega
        //agar koi error aati hai to wo humko mil jaayegi 
        const { error } = registerSchema.validate(req.body);

        if (error) {
            return next(error);    //throwing error 
        }
        //Check if user is in the database already
        try {
            //abhi aage banayenge hum User model just abhi use krr rhe hai 
            //exists ek mongoose kii method hai
            //hum req se jop email aa rhi hai usko dekhenge apne database mai for existance
            const exist = await User.exists({ email: req.body.email });
            //hum apni custom error ko throw karenge agar user already exist karta hai to 
            if (exist) {
                return next(CustomErrorHandler.alreadyExist('This email is already taken'));
            }
        } catch (error) {
            return next(error);
        }


        //Password ko hum hash karke store karte hai database mai 
        //Hash Password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        //Prepare the model 
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })


        //Hash krr liya password upper ,user ka model vii bnn liya avv hum isko save karayenge database mai
        let access_token;
        try {
            const result = await user.save();
            console.log(result);
            //Token create karenge hum jwt ke through
            access_token = JwtService.sign({ _id: result._id, role: result.role })

        } catch (error) {
            return next(error);
        }

        res.json({ access_token: access_token });
    }
}

export default registerController;