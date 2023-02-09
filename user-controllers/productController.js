import { product } from '../Models';
import multer from 'multer';
import CustomErrorHandler from '../Services/CustomErrorHandler';
import path from 'path';
import fs from 'fs';
import Joi from 'joi';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})
const handleMultipartData = multer({ storage, limits: { fileSize: 1000000 * 10 } }).single('image');

const productController = {

    async store(req, res, next) {

        //Multipart form data
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }

            const filePath = req.file.path;

            //validation
            const productSchema = Joi.object({
                name: Joi.string().required(),
                price: Joi.number().required(),
                size: Joi.string().required(),
            })
            const { error } = productSchema.validate(req.body);
            if (error) {
                // Delete the uploaded file
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    //This callback will get called each time when file gets deleted
                    if (err) {
                        return next(CustomErrorHandler.serverError(err.message));
                    }
                });
                return next(error);
            }

            const { name, price, size } = req.body;

            let document;
            try {
                document = await product.create({
                    name: name,
                    price: price,
                    size: size,
                    image: filePath
                });
            } catch (error) {
                return next(error);
            }
            res.status(201).json(document);
        })

    }
}
export default productController;