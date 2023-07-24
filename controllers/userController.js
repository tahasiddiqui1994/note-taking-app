import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {User} from '../models/User'; // Import the User model from your Sequelize setup

const secretKey = 'my-very-very-very-secret-key';

export async function authenticateJWT(req, res, next) {
  const token = req.headers.authorization.split(' ')[1] || null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication failed. Token not provided.' });
  }
  console.log('token', token);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      // console.log('err', err);
      return res.status(403).json({ message: 'Authentication failed. Invalid token.' });
    }

    console.log('user: ', user);
    // Attach the user data to the request for use in the API logic
    req.user = user;
    next();
  });
}

export async function registerUser(req, res) {
  try {
    console.log('req.body: ', req.body);
    console.log('User: ', User);
    const { username, email, password } = req.body;

    // Check if the user with the same email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error, message: error.message });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Check if the user exists based on email
    if (!email || !password) {
      res.status(403).json({ message: "Please provide email and password" });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error, message: error.message });
  }
}