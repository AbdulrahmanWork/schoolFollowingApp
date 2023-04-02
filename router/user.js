import express from 'express';
import {
  deleteUser,
  getAllUser,
  login,
  register,
  verifyEamil,
} from '../controller/user.js';
import { verifyToken } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/all', [verifyToken, admin], getAllUser);
userRouter.delete('/:id', [verifyToken, admin], deleteUser);
userRouter.get('/verify/:id', verifyEamil);
export default userRouter;
