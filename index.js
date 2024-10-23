require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const { secret } = require("./config/secret");
const PORT = secret.port || 7000;
const morgan = require("morgan");

// Middleware
const globalErrorHandler = require("./middleware/global-error-handler");
const verify = require("./middleware/verifyToken"); // Import your verify middleware
const authorize = require("./middleware/authorization"); // Import your authorization middleware

// Routes
const userRoutes = require("./routes/user.routes");
const categoryRoutes = require("./routes/category.routes");
const brandRoutes = require("./routes/brand.routes");
const userOrderRoutes = require("./routes/user.order.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const couponRoutes = require("./routes/coupon.routes");
const reviewRoutes = require("./routes/review.routes");
const adminRoutes = require("./routes/admin.routes");
const cloudinaryRoutes = require("./routes/cloudinary.routes");

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

// Connect database
connectDB();

app.use("/api/user", userRoutes); // Allow access to user routes (including login) without token
app.use("/api/category", categoryRoutes); // Protect all category routes
app.use("/api/brand", brandRoutes); // Protect all brand routes
app.use("/api/product", productRoutes); // Protect all product routes
app.use("/api/order", orderRoutes); // Protect all order routes
app.use("/api/coupon", couponRoutes); // Protect all coupon routes
app.use("/api/user-order", userOrderRoutes); // Protect all user-order routes
app.use("/api/review", reviewRoutes); // Protect all review routes
app.use("/api/cloudinary", cloudinaryRoutes); // Protect all cloudinary routes
app.use("/api/admin", adminRoutes); // Protect admin routes for admin role

// Root route
app.get("/", (req, res) => res.send("Apps worked successfully"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Global error handler
app.use(globalErrorHandler);

// Handle not found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
  next();
});

module.exports = app;
