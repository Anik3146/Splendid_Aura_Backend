const { secret } = require("../config/secret");
const stripe = require("stripe")(secret.stripe_key);
const Order = require("../model/Order");

// create-payment-intent
exports.paymentIntent = async (req, res, next) => {
  try {
    const product = req.body;
    const price = Number(product.price);
    const amount = price * 100;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "usd",
      amount: amount,
      payment_method_types: ["card"],
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
// addOrder
exports.addOrder = async (req, res, next) => {
  try {
    const orderItems = await Order.create(req.body);

    res.status(200).json({
      success: true,
      message: "Order added successfully",
      order: orderItems,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
// get Orders
exports.getOrders = async (req, res, next) => {
  try {
    const orderItems = await Order.find({}).populate("user");
    res.status(200).json({
      success: true,
      data: orderItems,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
// get Orders
exports.getSingleOrder = async (req, res, next) => {
  try {
    const orderItem = await Order.findById(req.params.id).populate("user");
    res.status(200).json(orderItem);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.updateOrderStatus = async (req, res) => {
  const newStatus = req.body.status;
  try {
    await Order.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          status: newStatus,
        },
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Delete Order
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete the order from the database
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      order: deletedOrder,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting the order",
    });
  }
};
