import User from "../models/user.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {

    const {name, email, password} = req.body;

    const userExists = await User.findOne({ email});
    if(userExists) return res.status(400).json({ massage: "user alrady exists"});

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    res.status(201).json({
        token: generateToken(user.id),
        user: { id: user._id, name: user.name, email: user.email},
    })
}

export const loginUser = async (req, res) => {

    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user) {
        return res.status(401).json({ massage: "invalid credentials"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ massage: "invalid credentials"});
    }

    res.json({
        token: generateToken(user._id),
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isRestricted:user.isRestricted,
        },
    });
};