// models/User.js

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: function() { return !this.isGoogleUser; } 
  },
  role: { type: String, enum: ['admin', 'visiteur'], default: 'visiteur' },
  isGoogleUser: { type: Boolean, default: false },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postalCode: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

// Hachage du mot de passe avant sauvegarde
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
