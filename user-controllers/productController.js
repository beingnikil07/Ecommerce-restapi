import { product } from '../Models';
import multer from 'multer';
import CustomErrorHandler from '../Services/CustomErrorHandler';
import path from 'path';

// abhi humko yha prr define karna hai kii hamari jo file hai wo kha prr store hogi,aur uska 
// path kya hoga ,uska filename kya hoga ye svv 

//destination function humko multer mai mil jaata hai jo req,file aur ek callback leta hai 
const storage = multer.diskStorage({
    //uploads mean kha prr file ko upload karna hai 
    //ye null parameter error ke liye hota hai 
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        //this will create a random name of the file with extension
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})

//setting up size limit of file.....
// single('image') ke ander aapne jo filed ka name(image) rakha hai yehi aapko requested karte time
// api se dena hoga 
const handleMultipartData = multer({ storage, limits: { fileSize: 1000000 * 10 } }).single('image');
const productController = {
    async store(req, res, next) {
        //Multipart form data
        handleMultipartData(req, res, (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }
            const filePath = req.file.path;
            console.log(req.file);
        })
        res.json({});

    }
}

export default productController;