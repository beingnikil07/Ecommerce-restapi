import mongoose from "mongoose";

const RefreshTokenSchema = mongoose.Schema({
    token: {
        type: String,
        unique: true
    }
});

export default mongoose.model('RefreshToken', RefreshTokenSchema, 'refreshTokens');