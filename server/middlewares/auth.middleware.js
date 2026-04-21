import jwt from 'jsonwebtoken';

const protect = (req,res,next) => {
    try{
    const authHeader =
      req.headers.authorization || req.headers.authentication;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if(!token)
        return res.status(401).json({message : "No Token , access denied "} )

    const decoded = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)

    req.user = decoded 

    next() ;

}
catch(err){
    if(err.name === 'TokenExpiredError'){
        return res.status(401).json({message : 'Token Expired '})
    }
    return res.status(401).json({ message: 'Invalid token' });
}
} 

export default protect ;
