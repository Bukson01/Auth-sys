require("dotenv").config()
const { sign, verify } = require("jsonwebtoken");

// a function that creats the token 
const createTokens = (user) => {
  const accessToken = sign(
    { username: user.username, id: user.id }, 
    process.env.ACCESS_TOKEN_SECRET, 
    { expiresIn: process.env.JWT_EXPIRE }  
  );
  return accessToken;
};

//a function that checks the validity of the tokens after using cookies by ensuring if it is expired or not
const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken)
    return res.status(400).json({ error: "User not Authenticated!" });

  try {
    const validToken = verify(accessToken, );
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

module.exports = { createTokens, validateToken };