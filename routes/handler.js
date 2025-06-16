const express = require('express');
const { registerUser, registerSeller, login, getAllSellers, loginSeller, loginUser } = require('../authentication/Auth');
const { addProduct, getAllProduct, getSellerProducts, deleteProduct } = require('../controllers/productController');
const { isLoggedIn } = require('../middleware/authenticate');

const router = express.Router()

router.route('/registerUser').post(registerUser)
router.route('/registerSeller').post(registerSeller)
router.route('/loginUser').post(loginUser)
router.route('/loginSeller').post(loginSeller)
router.route('/addProduct').post(isLoggedIn, addProduct)
router.route('/products').get(getAllProduct)
router.route('/sellers').get(getAllSellers)
router.route('/getSellerProduct').get(isLoggedIn, getSellerProducts)
router.route('/product/:id').delete(isLoggedIn, deleteProduct)




module.exports = router