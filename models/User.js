// models/User.js


import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
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
  
    profileImagePath: {
        type: String,
        default: "assets/default-profile.png",
    },
    role: {
        type: String,
        enum: ['visiteur', 'admin'], 
        default: "visiteur"
    },
    adress: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },

    country: {
        type: String,
    },

    postalCode: {
        type: Number,
    },

    
    isGoogleUser: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);