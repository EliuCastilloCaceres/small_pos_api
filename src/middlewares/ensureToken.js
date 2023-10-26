const ensureToken = (req,res,next) => {
    //console.log('Accediendo al middleware')
    const authorization_header = req.headers['authorization'];
    if(authorization_header !== undefined){
        //console.log(authorization_header);
        const token = authorization_header.split(' ')[1];
        req.token = token
        next();
    }else{
      
       return res.status(403).json({errorMessage:'Access denied, must authenticate'})
    }
}
exports.ensureToken = ensureToken;