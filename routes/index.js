import express from 'express';
const router = express.Router();   //Including express router 
import { registerController, loginController, userController } from '../user-controllers';
import auth from '../Middlewares/auth.js';

router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/me', auth, userController.me);    //auth middleware ko vii rakha 


export default router;