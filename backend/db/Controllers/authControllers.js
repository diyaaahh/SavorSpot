import User from "../Models/User.js"
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'

export const registerUser =async (req, res) => {
    const { fullName, phoneNo, email, password, confirmPassword } = req.body;

    if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
   }
    if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
   }

   try{
    const existing = await User.findOne({email})
    if (existing){
        return res.status(409).json({message:"The user already exists!"})
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const newUser= new User({
        fullName,
        phoneNo,
        email,
        password:hashedPassword
    })
    await newUser.save();
    return res.status(201).json({ message: 'Signup successful' });

   }catch(error){
    console.log(error)
   }
}

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const loginUser = async(req,res) => {
const {email, password, remember}=req.body;

try{
    const user= await User.findOne({email})
        if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (!user.password) {
      return res.status(500).json({ message: 'Stored password is missing for this user' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    if (!user) return res.status(400).json({ message: 'User not found' });


    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: remember ? 7 * 24 * 60 * 60 * 1000 : 15 * 60 * 1000,
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ message: 'Login successful', user: { fullName: user.fullName, email: user.email } });

}catch(error){
    console.log(error);
}
}

export const updateUserLocation = async (req, res) => {
  const { location } = req.body;
  const userId = req.user.id;
  if (!location || location.length !== 2) {
    return res.status(400).json({ message: 'Invalid location' });
  }

  try {
    const user = await User.findByIdAndUpdate(userId, { location }, { new: true });
    res.status(200).json({ message: 'Location updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update location' });
  }
};

export const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token missing' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const newAccessToken = generateAccessToken({ _id: decoded.id });

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 15 * 60 * 1000 // 15 mins
    });

    res.status(200).json({ message: 'Access token refreshed' });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};