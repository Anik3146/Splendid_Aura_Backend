const express = require("express");
const router = express.Router();
// internal
const productController = require("../controller/product.controller");
const verify = require("../middleware/verifyToken"); // Make sure to import your verify middleware

// get all products
router.get("/all", productController.getAllProducts);
// get offer timer product
router.get("/offer", productController.getOfferTimerProducts);
// top rated products
router.get("/top-rated", productController.getTopRatedProducts);
// reviews products
router.get("/review-product", productController.reviewProducts);
// get popular products by type
router.get("/popular/:type", productController.getPopularProductByType);
// get Related Products
router.get("/related-product/:id", productController.getRelatedProducts);
// get Single Product
router.get("/single-product/:id", productController.getSingleProduct);
// stock Product
router.get("/stock-out", productController.stockOutProducts);
// get Products ByType
router.get("/:type", productController.getProductsByType);

router.use(verify); // Apply the verify middleware to all routes below

// add a product
router.post("/add", productController.addProduct);
// add all product
router.post("/add-all", productController.addAllProducts);
// get Single Product
router.patch("/edit-product/:id", productController.updateProduct);
// get Products ByType
router.delete("/:id", productController.deleteProduct);

module.exports = router;
