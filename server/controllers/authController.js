import jwt from 'jsonwebtoken'
import bcrypt from'bcryptjs'
import User from '../models/User.js'
 

const generateAccessToken = (userId) =>{
   return jwt.sign( {id : userId} ,
    process.env.ACCESS_TOKEN_SECRET ,
    {expiresIn : '15m'}
   );
};

const generateRefreshToken = (userId) =>{
        return jwt.sign(
            {id : userId},
            process.env.REFRESH_TOKEN_SECRET ,
          {expiresIn : '7d'}
        );
};


//-----------------
// REGISTER 
//-----------------


export const register = async (req,res) => {
    try{

        const {name ,email , password} = req.body ;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        const normalizedEmail = email.toLowerCase();

        const alreadyExists = await User.findOne({ email: normalizedEmail }) 

        if(alreadyExists){
            return res.status(400).json({message : "Email is already registered"})
        }

        const salt = await bcrypt.genSalt(10) ;
        const hashedPassword = await bcrypt.hash(password , salt);

        const user = await User.create({
            name ,
            email : normalizedEmail ,
            password : hashedPassword ,
            authProvider : 'local'
        });

        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken(user._id) 

        res.cookie('refreshToken' , refreshToken ,{
            httpOnly : true  ,
            secure : process.env.NODE_ENV === 'production',
            sameSite : 'strict' ,
            maxAge : 7 *24 * 60 *60 *1000 ,
        })

       res.status(201).json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },

    });

    }
    catch(err){
        res.status(500).json({message : err.message}) ;
    }
};


//-------------
// LOGIN
//-------------

export const login = async(req , res) =>{

    try {
    const {email , password} =  req.body ;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }) 

    if(!user){
        return res.status(400).json({message : "Account doesn't exist with this email"})
    }

    if(user.authProvider === 'google'){
        return res.status(400).json({message : "Please login using your google account"})
    }
    const isMatch = await bcrypt.compare(password , user.password)
    if(!isMatch){
        return res.status(400).json({message : "Invalid Credentials "})
    }
    const accessToken =  generateAccessToken(user._id)
    const refreshToken =  generateRefreshToken(user._id)


    res.cookie('refreshToken' , refreshToken ,{
        httpOnly : true ,
        secure : process.env.NODE_ENV === 'production',
        sameSite : 'strict',
        maxAge : 7 *24 *60*60*1000 ,

    })
    res.status(200).json({
        accessToken ,user : {
            id :user._id ,
            email : user.email ,
            name : user.name ,
            avatar : user.avatar ,
            role : user.role ,

        }
    });
}
catch(err){
    res.status(500).json({message : err.message });
}
};

//-----------------
// Refresh Token
//-----------------

export const refresh = async (req, res) =>{
    try{

        const token = req.cookies.refreshToken

        if(!token){
            return res.status(401).json({
                message : "no refresh token found "
            })
        }

        const decoded = jwt.verify(token , process.env.REFRESH_TOKEN_SECRET)

        const accessToken = generateAccessToken(decoded.id);

        res.status(200).json({ accessToken });
    }
    catch(err){
       return res.status(401).json({message : "Refresh Token timed out : "})
    }
}


// --------------------------------
// GOOGLE OAUTH CALLBACK
// --------------------------------
export const googleCallback = (req, res) => {
  try {
    // req.user passport ne set kiya hoga
    const user = req.user;

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

  
    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${accessToken}`
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//----------
// Logout
//----------

export const logout = (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({ message: 'Logged out successfully' });
};


// --------------------------------
// GET CURRENT USER
// --------------------------------
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
