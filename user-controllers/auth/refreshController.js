import Joi from 'joi';
import { REFRESH_SECRET } from '../../config';
import { RefreshToken, User } from '../../Models';
import CustomErrorHandler from '../../Services/CustomErrorHandler';
import JwtService from '../../Services/JwtService';

const refreshController = {
    async refresh(req, res, next) {
        //Validate the receiving data which is receiving from request body
        //Validation 
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required()
        });
        const { error } = refreshSchema.validate(req.body);
        if (error) {
            return next(error);
        }


        //Avi hum token ko database mai check karenge ,agar token hai to he hum issue karenge
        //agar token nhi hai,mean token already revoke kiya gya hai mean user ne usko already 
        // logout kiya hai 
        let refreshtoken;
        try {

            refreshtoken = await RefreshToken.findOne({ token: req.body.refresh_token });

            // Agar token nhi hai to matlab kisi ne to isko revoke kiya hai ya logout kiya hai
            if (!refreshtoken) {

                return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
            }
            //agar refresh token hai to abhi humko usko verify karana padega ,aur jvv vii hum
            //token ko verify karate hai ,to token verify jvv ho jaata hai to vo payload return karta hai
            //aur payload mai hamari id aur role ko store kiya tha
            let userId;
            try {
                // refreshtoken hamara database se jo return hora wo hai aur usme 
                //  hum token ko le rhe hai 
                const { _id } = await JwtService.verify(refreshtoken.token, REFRESH_SECRET);
                userId = _id;  //assigning _id from token
            } catch (err) {
                return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
            }

            // Abhi hum user ko dekhenge kii kya jo token verify se id lii hai iss id ka koi 
            // user exist karta hai hamare database mai
            const user = await User.findOne({ _id: userId });
            if (!user) {
                return next(CustomErrorHandler.unAuthorized('No user found'));
            }


            //abhi itna svv hone ke baad hum new tokens generate karenge new access token aur refresh token

            const access_token = JwtService.sign({ _id: user._id, role: user.role });
            const refresh_token = JwtService.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);

            //whitelist in database
            await RefreshToken.create({ token: refresh_token });

            res.json({ access_token: access_token, refresh_token: refresh_token });

        } catch (err) {
            //or you may just pass err object received  from catch
            return next(new Error('Something went wrong' + err.message));
        }
    }
}
export default refreshController;