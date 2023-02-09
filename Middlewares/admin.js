import { User } from '../Models';
import CustomErrorHandler from '../Services/CustomErrorHandler';
const admin = async (req, res, next) => {

    try {
        const user = await User.findOne({ _id: req.user._id });
        if (user.role === 'admin') {
            next();
        } else {
            return next(CustomErrorHandler.unAuthorized());
        }

    } catch (error) {
        return next(CustomErrorHandler.serverError());
    }
}
export default admin;
