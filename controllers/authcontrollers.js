const user = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Login controller
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if input is email or username
        const isEmail = username.includes('@');
        
        // Find user by username or email
        const user = await User.findOne(
            isEmail ? { email: username } : { username }
        );
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
        
        // Check password
        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Return success response with token
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                profilePicture: user.profilePicture
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
};

// Forgot password controller
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        // Generate token
        const resetToken = crypto.randomBytes(20).toString('hex');
        
        // Set token and expiry on user model
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        
        await user.save();
        
        // Here you would normally send an email with reset link
        // For this example, we'll just return the token
        
        res.status(200).json({
            success: true,
            message: 'Password reset token generated',
            resetToken
        });
        
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during password reset request' 
        });
    }
};
