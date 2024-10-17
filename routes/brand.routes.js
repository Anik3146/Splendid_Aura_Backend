const express = require("express");
const router = express.Router();
// internal
const brandController = require("../controller/brand.controller");
const verify = require("../middleware/verifyToken"); // Make sure to import your verify middleware

// get Active Brands
router.get("/active", brandController.getActiveBrands);
// get all Brands
router.get("/all", brandController.getAllBrands);
// get single
router.get("/get/:id", brandController.getSingleBrand);

router.use(verify); // Apply the verify middleware to all routes below
// delete product
router.patch("/edit/:id", brandController.updateBrand);
// add Brand
router.post("/add", brandController.addBrand);
// add All Brand
router.post("/add-all", brandController.addAllBrand);
// delete brand
router.delete("/delete/:id", brandController.deleteBrand);

module.exports = router;
