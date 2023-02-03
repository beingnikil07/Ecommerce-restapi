import express from 'express';
const router = express.Router();   //Including express router 
import { registerController,loginController } from '../user-controllers';


router.post('/register', registerController.register);
router.post('/login', loginController.login);


export default router;