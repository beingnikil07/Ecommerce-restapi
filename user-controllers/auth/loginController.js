import Joi from "joi";
import { User, RefreshToken } from "../../Models";
import CustomErrorHandler from "../../Services/CustomErrorHandler";
import bcrypt from 'bcrypt';
import JwtService from "../../Services/JwtService";
import { REFRESH_SECRET } from "../../config";

const loginController = {
    async login(req, res, next) {

        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp(`^[a-zA-Z0-9]{3,30}`)).required()
        });

        const { error } = loginSchema.validate(req.body);

        if (error) {
            return next(error);
        }
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return next(CustomErrorHandler.wrongCredentials());
            }
            const match = await bcrypt.compare(req.body.password, user.password);
            if (!match) {
                return next(CustomErrorHandler.wrongCredentials());
            }
            const access_token = JwtService.sign({ _id: user._id, role: user.role });
            const refresh_token = JwtService.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);

            //whitelist in database
            await RefreshToken.create({ token: refresh_token });

            res.json({ access_token: access_token, refresh_token: refresh_token });

        } catch (error) {
            return next(error);
        }
    }
}
export default loginController;