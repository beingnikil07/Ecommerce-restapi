import express from 'express';
const router = express.Router();   //Including express router 
import { registerController, loginController, userController, refreshController } from '../user-controllers';
import auth from '../Middlewares/auth.js';

router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/me', auth, userController.me);
router.post('/refresh', refreshController.refresh);
router.post('/logout',auth, loginController.logout);


export default router;