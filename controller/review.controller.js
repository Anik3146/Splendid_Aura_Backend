const mongoose = require("mongoose");
const Order = require("../model/Order");
const Products = require("../model/Products");
const Review = require("../model/Review");
const User = require("../model/User");

// add a review
exports.addReview = async (req, res, next) => {
  const { userId, productId, rating, comment } = req.body;
  try {
    // Check if the user has already left a review for this product
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already left a review for this product." });
    }
    const checkPurchase = await Order.findOne({
      user: new mongoose.Types.ObjectId(userId),
      "cart._id": { $in: [productId] },
    });
    if (!checkPurchase) {
      return res
        .status(400)
        .json({ message: "Without purchase you can not give here review!" });
    }

    // Create the new review
    const review = await Review.create(req.body);
    // console.log('review-->',review)

    // Add the review to the product's reviews array
    const product = await Products.findById(productId);
    product.reviews.push(review._id);
    await product.save();

    // Add the review to the user's reviews array
    const user = await User.findById(userId);
    user.reviews.push(review._id);
    await user.save();

    return res.status(201).json({ message: "Review added successfully." });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// delete a review
exports.deleteReviews = async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get all reviews
exports.getAllReviews = async (req, res, next) => {
  try {
    // Fetch all reviews and populate user and product details
    const reviews = await Review.find()
      .populate("userId", "name email") // Populate user information (name, email)
      .populate("productId", "name price") // Populate product information (name, price)
      .exec();

    // If no reviews are found
    if (reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found." });
    }

    // Return all reviews with populated user and product data
    return res.status(200).json({ reviews });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// delete a review
exports.deleteSingleReviews = async (req, res, next) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
