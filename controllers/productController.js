const productModel = require("../model/ProductModel");
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');


// configure cloudinary
// cloudinary.config({ 
//   cloud_name: 'mayor_project', 
//   api_key: '335474817675132', 
//   api_secret: 'p1wRybg3I05CwvYnDjJa2ir3ofA'
// });


// const addProduct = async (req, res) => {
//   try {
//     // Check if req.body exists
//     if (!req.body) {
//       return res.status(400).json({ error: "No form data received" });
//     }

//     const { productName, description, socials, phoneNumber } = req.body;

//     if (!productName || !description || !socials || !phoneNumber) {
//       return res.status(400).json({ error: "Please fill all inputs" });
//     }

//     // Upload image to Cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path);

//     const newProduct = new productModel({
//       productName,
//       description,
//       socials,
//       phoneNumber,
//       productImage: result.secure_url
//     });

//     await newProduct.save();

//     return res.status(200).json({ message: "Product uploaded successfully", product: newProduct });

//   } catch (error) {
//     console.error("Upload Error:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };




// uploading the product
const addProduct = async (req, res) => {

    try {
      const { productName, description, socials, phoneNumber, price } = req.body;
  
      // Validate required fields
      if (!productName || !description || !socials || !phoneNumber || !price) {
        return res.status(400).json({ error: "Please fill all credentials" });
      }
  
      // Check if files were uploaded
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }
  
      console.log('req.files >>>', req.files); 
  
      const imageFile = req.files.productImage;
      const uploadsDir = path.join(__dirname, '../uploads/');
  
      // Create the uploads directory if it doesn't exist
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }
  
      // Generate a unique filename using Date.now()
      const fileName = `${Date.now()}-${imageFile.name}`;
      const uploadPath = path.join(uploadsDir, fileName);
  
      // Move the file to the upload directory
      imageFile.mv(uploadPath, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
      });
  
      // Create a new product in the database
      const newProduct = new productModel({
        productName,
        description,
        socials,
        phoneNumber,
        price,
        productImage: fileName,
      });
  
      if (!newProduct) {
        return res.status(500).json({ error: "Your product was not created" });
      }

      await newProduct.save()
  
      return res.status(201).json({ message: "Product was uploaded successfully", newProduct });
  
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "An error occurred while uploading the product" });
    }
  };
  

 const getAllProduct = async (req, res) => {
  try {
    const products = await productModel.find();
    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};


const getSellerProducts = async (req, res) => {
  const { sellerId } = req.params;

  if (!sellerId) {
    return res.status(400).json({ error: "Seller ID is required" });
  }

  try {
    const products = await productModel.find({ sellerId });

    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No products found for this seller" });
    }

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};



module.exports = {
    addProduct,
    getAllProduct,
    getSellerProducts
}