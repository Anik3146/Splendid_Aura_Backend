const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");

// Define routes without token verification first
router.post("/signup", userController.signup); // No token required
router.post("/login", userController.login); // No token required

// Apply middleware for the remaining routes
const verify = require("../middleware/verifyToken"); // Make sure to import your verify middleware

// Password management and other routes (these require authentication)
router.patch("/forget-password", userController.forgetPassword);
router.patch("/confirm-forget-password", userController.confirmForgetPassword);
router.patch("/change-password", userController.changePassword);
router.get("/confirmEmail/:token", userController.confirmEmail);
router.put("/update-user/:id", userController.updateUser);
router.post("/register/:token", userController.signUpWithProvider);
router.use(verify); // Apply the verify middleware to all routes below
router.get("/all", userController.getAllUser); // Requires token
router.delete("/delete-user/:id", userController.deleteUser); // New route to delete a user

module.exports = router;
