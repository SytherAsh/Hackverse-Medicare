const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ROLES_LIST = require('../config/roles_list');

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    console.log(req.body);
    // Check if name, email, password, and role are provided
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      const roleValue = ROLES_LIST[role];  // Convert role string to numeric role
      console.log(roleValue);
      // Register Student and other approved roles directly
      if (roleValue) {
        const user = new User({
          name,
          email,
          password: await bcrypt.hash(password, 10),
          role: roleValue  // Set the numeric role directly
        });
        // console.log(user);
        await user.save();
        return res.status(201).json({ message: 'Registration successful' });
      } else {
        // Handle invalid roles
        return res.status(400).json({ message: 'Invalid role' });
      }
    } catch (err) {
      // console.log(err.message);
      return res.status(500).json({ message: err.message });
    }
  };  

// Login logic
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'All fields are required' });

    try {
        const user = await User.findOne({ email }).exec();
        if (!user) return res.status(401).json({ message: 'User not found' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Incorrect password' });

        // Generate JWT
        console.log(user)
        console.log("hi");
        const accessToken = jwt.sign(
            { UserInfo: { 
                id: user._id, 
                email: user.email, 
                role: user.role 
            } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10h' }
        );
        console.log(accessToken);
        // Set token as an HTTP-only cookie
        res.cookie('jwt', accessToken, {  
            httpOnly: true, // accessible only by web server
            // secure: process.env.NODE_ENV === 'production', // only use secure cookies in production
            secure: true,
            sameSite: 'None', // cross-site cookie
            maxAge: 60 * 60 * 10000 // 1 hour
        });
        res.status(200).json({user,accessToken});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const logoutUser = (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        secure:true,
        sameSite: 'None'
    });
    res.status(200).json({ message: 'Logged out' });
};

module.exports = { registerUser, loginUser, logoutUser };