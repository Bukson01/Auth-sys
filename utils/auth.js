require("dotenv").config()
const { verify } = require("jsonwebtoken");

module.exports.authenticateToken = (req, res, next) =>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
};

/*
if (typeof authHeader !== "undefined") {
  const bearer = authHeader.split(" ");
  const token = bearer[1];
  // Verify if token is valid
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    // If the token is invalid send a Forbidden 413
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid Token" });
    } else {
      req.user = decode;
      next();
    }
  });
} else {
  //If header is undefined return Forbidden (403)
  res.status(403).json({ success: false, message: "Forbidden Request" });
}
};*/