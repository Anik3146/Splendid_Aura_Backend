const express = require("express");
const router = express.Router();
const {
  addReview,
  deleteReviews,
  getAllReviews,
} = require("../controller/review.controller");
const verify = require("../middleware/verifyToken"); // Make sure to import your verify middleware

// add a review
router.post("/add", addReview);

// Get all reviews (new route)
router.get("/all", getAllReviews);

//router.use(verify); // Apply the verify middleware to all routes below
router.use(verify);
// delete reviews
router.delete("/delete/:id", deleteReviews);

module.exports = router;
