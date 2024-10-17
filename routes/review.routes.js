const express = require("express");
const router = express.Router();
const { addReview, deleteReviews } = require("../controller/review.controller");
const verify = require("../middleware/verifyToken"); // Make sure to import your verify middleware

router.use(verify); // Apply the verify middleware to all routes below

// add a review
router.post("/add", addReview);
// delete reviews
router.delete("/delete/:id", deleteReviews);

module.exports = router;
