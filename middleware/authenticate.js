// // imported jwt
// const jwt = require ('jsonwebtoken');
// const sellerModel = require('../model/SellerModel');
// require('dotenv').config();
// // imported the usermodel from the model folder and user file

// const isLoggedIn = async (req, res, next) => {
//     // to verify token using jwt
//     let token;
    
//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
//         try {
//             token = req.headers.authorization.split(' ')[1];
//             const decoded = jwt.verify(token, process.env.jwt_secret);
//             req.user = await sellerModel.findById(decoded.id);
//             if(!req.user){
//                 return res.status(401).json({error: "not authorized, pls login"});
//             }

//         } catch (error) {
//             console.log(error.message);
//             return res.status(403).json({error:"Invalid token"});
            
//         }
        
//     }

//     if(!token) {
//         return res.status(401).json({error: "token is missing from the header"});
//     }

//     next()
// }



// module.exports = {isLoggedIn}



// middleware/verifyToken.js
const jwt         = require("jsonwebtoken");
const sellerModel = require("../model/SellerModel");
const userModel = require("../model/UserModel");


// const isLoggedIn = async (req, res, next) => {
//   const auth = req.headers.authorization || "";

//   if (!auth.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "Token missing from header" });
//   }

//   const token = auth.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     let current;
//     if (decoded.role === "seller") {
//       current = await sellerModel.findById(decoded.id);
//     } else if (decoded.role === "user") {
//       current = await userModel.findById(decoded.id);
//     }

//     if (!current) {
//       return res.status(401).json({ error: "Not authorized, please log in" });
//     }

//     req.user = current;      
//     req.role = decoded.role; 
//     next();
//   } catch (err) {
//     return res.status(403).json({ error: "Invalid token" });
//   }
// };

// module.exports = {isLoggedIn}



const isLoggedIn = async (req, res, next) => {
  const auth = req.headers.authorization || "";

  if (!auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token missing from header" });
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);

    let current;
    if (decoded.role === "seller") {
      current = await sellerModel.findById(decoded.id);
    } else if (decoded.role === "user") {
      current = await userModel.findById(decoded.id);
    }

    console.log("Current User Found:", current);

    if (!current) {
      return res.status(401).json({ error: "Not authorized, please log in" });
    }

    req.user = current;
    req.role = decoded.role;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token", details: err.message });
  }
};

module.exports = {isLoggedIn}