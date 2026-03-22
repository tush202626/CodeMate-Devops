const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    let existingUser = await User.findOne({ email });

    if(existingUser){
        return res.status(400).json({ message: 'User already exists' });
    }

    existingUser = await User.findOne({ username });

    if(existingUser){
        return res.status(400).json({ message: 'username taken, try another one...' });
    }

    const hashedPwd = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPwd, username });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, username: user.username, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error in logging', error: err.message });
  }
};