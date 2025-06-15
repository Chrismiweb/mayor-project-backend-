const mongoose = require('mongoose');
const {Schema, model} = mongoose;
const productSchema = new Schema({
    productName :{
        type: String,
        required: true
    },
    description :{
        type: String,
        required: true
    },
    productImage :{
        type: String,
        required: true
    },
    socials :{
        type: String,
        required: true 
    },
    phoneNumber :{
        type: String,
        required: true
    },
    price :{
        type: String,
        required: true
    },
    
});

const productModel = model("Product", productSchema)

module.exports = productModel

