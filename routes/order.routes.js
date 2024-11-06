const express = require("express");
const {
  paymentIntent,
  addOrder,
  getOrders,
  updateOrderStatus,
  getSingleOrder,
  deleteOrder,
} = require("../controller/order.controller");
const verify = require("../middleware/verifyToken"); // Make sure to import your verify middleware

// router
const router = express.Router();

// get orders
router.get("/orders", getOrders);
// single order
router.get("/:id", getSingleOrder);

router.use(verify); // Apply the verify middleware to all routes below

// add a create payment intent
router.post("/create-payment-intent", paymentIntent);
// save Order
router.post("/saveOrder", addOrder);
// update status
router.patch("/update-status/:id", updateOrderStatus);

// DELETE Order
router.delete("/delete-order/:id", deleteOrder);

module.exports = router;
