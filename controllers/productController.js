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

  
// controllers/productController.js
// uploaded a new product
const addProduct = async (req, res) => {
  /* 1️⃣  Allow only sellers */
  if (req.role !== "seller") {
    return res.status(403).json({ error: "Only sellers can upload products" });
  }

  /* 2️⃣  Get the seller’s Mongo _id from the middleware */
  const sellerId = req.user._id;   // ✅ correct field

  const { productName, description, socials, phoneNumber, price } = req.body;

  // Validate required fields
  if (!productName || !description || !socials || !phoneNumber || !price) {
    return res.status(400).json({ error: "Please fill all credentials" });
  }

  // Check if a file was uploaded
  if (!req.files || !req.files.productImage) {
    return res.status(400).json({ error: "Product image is required" });
  }

  /* -------- handle image upload exactly like before ---------- */
  const imageFile   = req.files.productImage;
  const uploadsDir  = path.join(__dirname, "../uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

  const fileName   = `${Date.now()}-${imageFile.name}`;
  const uploadPath = path.join(uploadsDir, fileName);

  await imageFile.mv(uploadPath);

  /* -------- save new product ---------- */
  const newProduct = await productModel.create({
    productName,
    description,
    socials,
    phoneNumber,
    price,
    productImage: fileName,
    sellerId,              
  });

  return res
    .status(201)
    .json({ message: "Product uploaded successfully", newProduct });
};


 const getAllProduct = async (req, res) => {
  try {
    const products = await productModel.find().sort({ createdAt: -1 });;
    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// get all product uploaded by a seller
const getSellerProducts = async (req, res) => {
  // Ensure only sellers can access this route
  if (req.role !== "seller") {
    return res.status(403).json({ error: "Only sellers can view their products" });
  }

  const sellerId = req.user._id;

  try {
    const products = await productModel.find({ sellerId }).sort({ createdAt: -1 });

    if (!products.length) {
      return res.status(404).json({ error: "No products found for this seller" });
    }

    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};


// delete a product using product id
const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  const sellerId = req.user._id; // set by isLoggedIn middleware

  try {
    // Find the product and verify ownership
    const product = await productModel.findOne({ _id: productId, sellerId });

    if (!product) {
      return res.status(404).json({ error: "Product not found or unauthorized" });
    }

    // Delete image file from uploads if exists
    const imagePath = path.join(__dirname, "../uploads", product.productImage);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Delete the product
    await productModel.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};


module.exports = {
    addProduct,
    getAllProduct,
    getSellerProducts,
    deleteProduct
}