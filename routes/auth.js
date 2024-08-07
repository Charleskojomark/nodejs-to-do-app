const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

require('dotenv').config();


router.post('/register', async (req, res)=>{
    const { username, email, password } = req.body;
    try {
        let existingUser = await User.findOne({ email });
        if (!existingUser) {
            existingUser = await User.findOne({ username });
        }
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists', success: false })
        }
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', success: true });
    } catch(error){
        res.status(500).json({ message: error.message, success: false });
    }
});


router.post('/login', async (req, res)=>{
    const { emailOrUsername, password } = req.body;
    try {
        let user = await User.findOne({ email: emailOrUsername });
        if (!user) {
            user = await User.findOne({ username: emailOrUsername });
        }
        if(!user){
            return res.status(400).json({ success: false, message: 'Invalid email or username' });
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({ success: false, message: 'Invalid password' });
        }
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        res.status(200).json({ token, success: true });
    } catch(error){
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/', async (req, res)=>{
    try {
        const users = await User.find();
        res.status(200).json({ success: true, message: 'Users retrieved successfully.', data: users});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/:id', async (req, res)=>{
    const { username, email, password } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, hash);
        }
        await user.save();
        res.status(200).json({ success: true ,message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/:id', async (req, res)=>{
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }
        await user.remove();
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


module.exports = router;