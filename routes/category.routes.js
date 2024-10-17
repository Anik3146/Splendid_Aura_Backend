const express = require("express");
const router = express.Router();
// internal
const categoryController = require("../controller/category.controller");
const verify = require("../middleware/verifyToken"); // Make sure to import your verify middleware

// get
router.get("/get/:id", categoryController.getSingleCategory);
// get all Category
router.get("/all", categoryController.getAllCategory);
// get Product Type Category
router.get("/show/:type", categoryController.getProductTypeCategory);
// get Show Category
router.get("/show", categoryController.getShowCategory);

router.use(verify); // Apply the verify middleware to all routes below
// add
router.post("/add", categoryController.addCategory);
// add All Category
router.post("/add-all", categoryController.addAllCategory);
// delete category
router.delete("/delete/:id", categoryController.deleteCategory);
// delete product
router.patch("/edit/:id", categoryController.updateCategory);

module.exports = router;
