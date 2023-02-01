import express from 'express';
const router = express.Router();   //Including express router 
import { registerController } from '../user-controllers';


router.post('/register', registerController.register);


export default router;