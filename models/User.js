// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function () {
            return !this.isGoogleUser;
        },
    },
    username: {
        type: String,
        required: true,
    },
    profileImagePath: {
        type: String,
        default: "assets/default-profile.png",
    },
    status: {
        type: String,
        enum: ['artiste', 'entreprise', 'visiteur'],
        // required: true,
        default: "visiteur"
    },
    siren: {
        type: String,
    },
    tvaNumber: {
        type: String,
    },
    description: {
        type: String,
    },
    isGoogleUser: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);