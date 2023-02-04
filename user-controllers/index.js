/* 
   Iss file ko maine isliye banayi so that mere ko baar baar routes folder
   wali file mai baar baar import na karna pde routes ko .mai iss file
   mai sabko import/export karunga isse bss mujhko sirf iss file ko
   import karna padega routes folder kii file mai aur iss file ke through 
   he mai sabko access krr paunga 

*/

export { default as registerController } from './auth/registerController';
export { default as loginController } from './auth/loginController';
export { default as userController } from './auth/userController';