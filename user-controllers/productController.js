import { product } from '../Models';
import multer from 'multer';
import CustomErrorHandler from '../Services/CustomErrorHandler';
import path from 'path';
import fs from 'fs';
import productSchema from '../validators/productValidator';

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

    },

    update(req, res, next) {
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }
            let filePath;
            if (req.file) {
                filePath = req.file.path;
            }

            // validation
            const { error } = productSchema.validate(req.body);
            if (error) {
                // Delete the uploaded file
                if (req.file) {
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if (err) {
                            return next(
                                CustomErrorHandler.serverError(err.message)
                            );
                        }
                    });
                }

                return next(error);
                // rootfolder/uploads/filename.png
            }

            const { name, price, size } = req.body;
            let document;
            try {
                document = await product.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        name,
                        price,
                        size,
                        ...(req.file && { image: filePath }),
                    },
                    { new: true }
                );
            } catch (err) {
                return next(err);
            }
            res.status(201).json(document);
        });
    },

    async delete(req, res, next) {
        const document = await product.findOneAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        //image delete
        const imagePath = document.image;
        //image delete hone ke baad ye callback call ho lega
        fs.unlink(`${appRoot}/${imagePath}`, (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError());
            }
        });
        res.json(document);
    },

    async getAllProducts(req, res, next) {
        let documents;

        try {
            documents = await product.find().select('-__v');

        } catch (error) {
            return next(CustomErrorHandler.serverError());
        }

        return res.status(201).json(documents);
    }

}
export default productController;