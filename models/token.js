import mongoose, { Schema } from 'mongoose';

const tokenSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
    },
    token: { type: String, required: true },
  },
  { timestamps: true }
);

const Token = mongoose.model('token', tokenSchema);
export default Token;
