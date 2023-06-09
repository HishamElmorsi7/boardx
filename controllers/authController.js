const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')

exports.signup = catchAsync( async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })

    const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    })

    res.status(200).json({
        token,
        status: 'success', 
        data: {
            user: newUser
        }
    })
}
)


