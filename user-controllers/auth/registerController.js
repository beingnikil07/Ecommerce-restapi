import Joi from "joi";    //importing joi library for validate user data  

const registerController = {
    register(req, res, next) {

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
        res.send({ msg: "I'm register end" });
    }
}

export default registerController;