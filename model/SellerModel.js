const mongoose = require('mongoose');
const {Schema, model} = mongoose;
const sellerSchema = new Schema({
    name :{type: String},
    email :{type: String},
    BusinessName :{type: String},
    Description :{type: String},
    password :{type: String},
    confirmPassword :{type: String},
    profileImage: {type: String},
    product:{
        type: mongoose.Types.ObjectId,
        ref:"Product"
    },
    
});

const sellerModel = model("Seller", sellerSchema)

module.exports = sellerModel