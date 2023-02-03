import Joi from "joi";
import { User } from "../../Models";
import CustomErrorHandler from "../../Services/CustomErrorHandler";
import bcrypt from 'bcrypt';
import JwtService from "../../Services/JwtService";

const loginController = {

    async login(req, res, next) {

        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp(`^[a-zA-Z0-9]{3,30}`)).required()
        });
        //error aayegi koi data mai to usko humne destructure krr liya req.body mai se
        const { error } = loginSchema.validate(req.body);
        //agar validation mai koi error hogi to ye usko through krr dega next statement
        //agar error nii hui to ye skip ho jaayega aur control next statement prr jaayega 
        if (error) {
            return next(error);

        }

        //Avv hum email kii existance ko dekhenge kii jo humko email mila hai ye hamare database
        //mai hai ya nhi
        try {
            const user = await User.findOne({ email: req.body.email });
            //agar user nhi mila to ye below wala statement chalega 
            if (!user) {
                //hum yha ek custom error banayenge apni joki hogi unauthorised error
                return next(CustomErrorHandler.wrongCredentials());
            }
            //agar user hai uss send kii gyi email ka to phir hum send kiye gye password 
            //ko match(compare) karenge tabhi hum usko login karenge .Login karenge matlab ek 
            //new token generate karke denge
            const match = await bcrypt.compare(req.body.password, user.password);
            //match nhi kiya to 
            if (!match) {
                return next(CustomErrorHandler.wrongCredentials());
            }
            //krr gya match to hum phir token ko generate karte hai 
            const access_token = JwtService.sign({ _id: user._id, role: user.role });
            //sending response to api
             res.json({ access_token: access_token });

        } catch (error) {
            //Agar trycatch block mai koi vii error aa jaati hai to usko hum return krr
            //denge try/catch se 
            return next(error);

        }
    }
}
export default loginController;