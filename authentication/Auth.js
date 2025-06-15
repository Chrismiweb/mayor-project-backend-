const sellerModel = require("../model/SellerModel")
const userModel = require("../model/UserModel")
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");





// register normal user
const registerUser = async(req, res)=>{
    const {username, email, password, confirmPassword} = req.body

    if(!username || !email || !password || !confirmPassword){
       return res.status(400).json({error: "please input all details to register"})
    }

    if(password !== confirmPassword){
       return res.status(400).json({error: "password and confirm password does not match"})
    }

    const existingUser =  await userModel.findOne({email})

    if(existingUser){
        return res.status(401).json({error: "user with this email address already exist, please try another email"})
    }

    // register new user
     const newUser = new userModel({
      username,
      email,
      password,
      confirmPassword
    });

    await newUser.save();

    return res.status(201).json({ message: "User registered successfully", newUser });
}


// register sellers
    const registerSeller = async(req, res) =>{
        const {name, email,businessName, password, confirmPassword} = req.body

         if(!name || !email || !businessName || !password || !confirmPassword){
            return res.status(400).json({error: "please input all details to register as a seller"})
        }

        if(password !== confirmPassword){
            return res.status(400).json({error: "password and confirm password does not match"})
        }

        const existingSellers = await sellerModel.findOne({email})

        if(existingSellers){
            return res.status(401).json({error: "Seller with this email already exist"})
        }

        const newSeller = new sellerModel({
            name,
            email, 
            businessName,
            password,
            confirmPassword
        })

        await newSeller.save()

        res.status(201).json({message: "Seller have registered Successfully", newSeller})



    }



    const login = async(req, res) =>{
        // input username/email and password
        const {identifier, password} = req.body

        if(!identifier || !password){
            return res.status(400).json({error: "please input all credentials to login"})
        }

        // check user
        let checkUser = await userModel.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        });

        let role = "user"

        // if not user check if seller
        if(!checkUser){
            checkUser = await sellerModel.findOne({
            $or :[{email :identifier, name: identifier}]
        })

         role = "seller"
        }

        if(!checkUser){
            return res.status(400).json({error:"user with this email or username does not have an account, please sign up"})
        }

         // Compare password (assuming you hash passwords before saving)
          if (password !== checkUser.password) {
            return res.status(400).json({ error: "Incorrect password" });
        }
        const token = jwt.sign({ userId : checkUser._id, role}, process.env.jwt_secret,{ expiresIn: "1h"});

          res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: checkUser._id,
                email: checkUser.email,
                role,
                ...(role === "user" ? { username: checkUser.username } : { name: checkUser.name, businessName: checkUser.businessName })
            }
        });

    }

    const getAllSellers = async (req, res) => {
  try {
    const sellers = await sellerModel.find();

    if (!sellers || sellers.length === 0) {
      return res.status(404).json({ error: "No sellers found" });
    }

    res.status(200).json({ sellers });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

    


module.exports = {
    registerUser,
    registerSeller,
    login,
    getAllSellers

}