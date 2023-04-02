import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import crypto from 'crypto';
import nodmailer from 'nodemailer';

export const sendVerifyEmail = (name, email, user_id) => {
  try {
    const transporter = nodmailer.createTransport({
      host: String(process.env.HOST),
      port: 2525,
      secure: true,
      requireTLS: true,
      auth: {
        user: String(process.env.USER),
        pass: String(process.env.PASS),
      },
    });
    const mailOptions = {
      from: String(process.env.USER),
      to: email,
      subject: 'For Verification Eamil',
      html: `<p>Hii ${name} please click the link here <a href="https://glamorous-ray-tie.cyclic.app/verify/${user_id}">Verify</a>you mail</p>`,
    };
    new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          reject(error);
        } else {
          res.status(200).json({ message: `email has been sent` });
        }
      });
    });
   
  } catch (error) {
    console.log(error.message);
  }
};

export const verifyEamil = async (req, res) => {
  try {
    const updateInfo = await User.findByIdAndUpdate(req.params.id, {
      verified: true,
    });
    if (updateInfo) {
      res.status(200).json(updateInfo);
      console.log(updateInfo);
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const register = async (req, res) => {
  const { name, email, password, confirmPassword, type, verified } = req.body;
  try {
    if (password === confirmPassword && password.length > 8) {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      const repeatedEmail = await User.findOne({ email: email });
      if (repeatedEmail) {
        return res.status(409).json({ message: 'Email is aleardy register' });
      }
      const newUser = new User({
        name,
        email,
        password: passwordHash,
        type: type,
        emailToken: crypto.randomBytes(64).toString('hex'),
        verified: verified,
      });
      const savedUser = await newUser.save();
      if (savedUser) {
        sendVerifyEmail(req.body.name, req.body.email, savedUser._id);
      }
      res.status(201).json(savedUser);
    } else {
      res.status(400).json({
        message:
          'password must be greater than 8 and password and confirm password must be equal',
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user)
      return res.status(400).json({ message: 'User does not exist. ' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: 'Email or Password is not correct' });

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      `${process.env.JWT_SECRET}`
    );
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.send('Id is not found');
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    await User.save();
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
