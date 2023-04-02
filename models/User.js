import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true, min: 5 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 8 },
    verified: { type: Boolean },
    isAdmin: { type: Boolean, default: false },
    type: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
