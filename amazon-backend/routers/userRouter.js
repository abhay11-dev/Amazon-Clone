import express from 'express';
import {
  registerUser,
  signInUser,
  getUserProfile,
  updateUserProfile,
  logoutUser,
  getAllUsers,
  getUserById,
  verifyCurrentPassword,
  deleteUser,
} from '../controllers/userController.js';
import { isAuth, isAdmin } from '../middlewares/authMiddleware.js';
import { validateRegister, validateSignIn } from '../middlewares/validation.js';

const userRouter = express.Router();

userRouter.post('/register', validateRegister, registerUser);
userRouter.post('/signin', validateSignIn, signInUser);
userRouter.post('/logout', isAuth, logoutUser);

userRouter.get('/profile', isAuth, getUserProfile);
userRouter.put('/profile', isAuth, updateUserProfile);
userRouter.post('/verify-password', isAuth, verifyCurrentPassword);
userRouter.get('/', isAuth, isAdmin, getAllUsers);
userRouter.get('/:id', isAuth, getUserById);
userRouter.delete('/:id', isAuth, isAdmin, deleteUser);

export default userRouter;
