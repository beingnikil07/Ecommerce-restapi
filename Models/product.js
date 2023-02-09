import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
    }
});

export default mongoose.model('Product', productSchema, 'products');