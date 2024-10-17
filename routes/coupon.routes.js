const express = require("express");
const router = express.Router();
const {
  addCoupon,
  addAllCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} = require("../controller/coupon.controller");
const verify = require("../middleware/verifyToken"); // Make sure to import your verify middleware

//get all coupon
router.get("/", getAllCoupons);

//get a coupon
router.get("/:id", getCouponById);

router.use(verify); // Apply the verify middleware to all routes below

//update a coupon
router.patch("/:id", updateCoupon);

//delete a coupon
router.delete("/:id", deleteCoupon);

//add a coupon
router.post("/add", addCoupon);

//add multiple coupon
router.post("/all", addAllCoupon);

module.exports = router;
