const sellerModel = require("../model/SellerModel")
const userModel = require("../model/UserModel")




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


module.exports = {
    registerUser,
    registerSeller

}