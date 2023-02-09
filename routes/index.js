import express from 'express';
const router = express.Router();   //Including express router 
import { registerController, loginController, userController, refreshController, productController } from '../user-controllers';
import auth from '../Middlewares/auth.js';
import admin from '../Middlewares/admin';

router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/me', auth, userController.me);
router.post('/refresh', refreshController.refresh);
router.post('/logout', auth, loginController.logout);

router.post('/products', [auth, admin], productController.store);    //route to create a product
router.put('/products/:id', [auth, admin], productController.update);    
router.delete('/products/:id', [auth, admin], productController.delete);    

router.get('/products',productController.getAllProducts);    


export default router;
