import User from '../models/userModel.js';
import { generateToken, generateRefreshToken, validateEmail } from '../utils.js';
import bcrypt from 'bcryptjs';
import AppError from '../middlewares/errorHandler.js';

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return next(new AppError('Please provide all required fields', 400));
    }

    if (password !== confirmPassword) {
      return next(new AppError('Passwords do not match', 400));
    }

    if (!validateEmail(email)) {
      return next(new AppError('Please provide a valid email address', 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already registered', 400));
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    const createdUser = await user.save();

    const token = generateToken(createdUser);
    const refreshToken = generateRefreshToken(createdUser);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
      },
      token,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const signInUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    if (!validateEmail(email)) {
      return next(new AppError('Please provide a valid email address', 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return next(new AppError('Invalid email or password', 401));
    }

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      token,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (name) {
      user.name = name;
    }

    if (email && email !== user.email) {
      if (!validateEmail(email)) {
        return next(new AppError('Please provide a valid email address', 400));
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(new AppError('Email already in use', 400));
      }

      user.email = email;
    }

    if (newPassword) {
      if (!currentPassword) {
        return next(new AppError('Please provide current password', 400));
      }

      const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);
      if (!isPasswordValid) {
        return next(new AppError('Current password is incorrect', 401));
      }

      user.password = bcrypt.hashSync(newPassword, 10);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyCurrentPassword = async (req, res, next) => {
  try {
    const { currentPassword } = req.body;

    if (!currentPassword) {
      return next(new AppError('Please provide your current password', 400));
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
