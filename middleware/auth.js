const jwt = require('jsonwebtoken');
const user = require('../models/user');

exports.protect = async (req, res, next) => {
    try {
        let token;
        
        // Check if authorization header exists and starts with Bearer
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        
        // Check if token exists
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authorized to access this route' 
            });
        }
        
        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get user from token
            const user = await User.findById(decoded.id);
            
            if (!user) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'User not found' 
                });
            }
            
            // Add user to request object
            req.user = user;
            next();
            
        } catch (error) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authorized to access this route' 
            });
        }
        
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error in authentication' 
        });
    }
};