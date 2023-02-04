import { User } from '../../Models';

const userController = {
    async me(req, res, next) {
        try {
            /*ye req.user._id kha se aa gya basically ye ek quary hai database mai,hum jis
              resource ko get karna chahte hai ye ek protected resource hai,aur without access 
              token ye humko kisi ko vii available nhi karani hai.... humko jo vii request aati hai 
              iss route(/me)  prr humko sabhi ko intercept karke uske ander sabse pehle check karna hai 
              kii token hai ya niii hai agar token hai to check karna hai valid token hai ya nhi
              iss kaam ko hum middleware kii help se karenge . 

            */

            const user = await User.findOne({ _id: req.user._id });

        } catch (error) {

        }





    }
}


export default userController;