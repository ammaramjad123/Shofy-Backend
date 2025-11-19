require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const { secret } = require("./config/secret");
const PORT = process.env.PORT || secret.port || 7000;
const morgan = require("morgan");

// error handler
const globalErrorHandler = require("./middleware/global-error-handler");

// routes
const userRoutes = require("./routes/user.routes");
const categoryRoutes = require("./routes/category.routes");
const brandRoutes = require("./routes/brand.routes");
const userOrderRoutes = require("./routes/user.order.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const couponRoutes = require("./routes/coupon.routes");
const reviewRoutes = require("./routes/review.routes");
const adminRoutes = require("./routes/admin.routes");
// const uploadRouter = require('./routes/uploadFile.route');
const cloudinaryRoutes = require("./routes/cloudinary.routes");

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

// connect database
connectDB();

// ✅ register routes first
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/products", productRoutes); // <-- important route
app.use("/api/order", orderRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/user-order", userOrderRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/cloudinary", cloudinaryRoutes);
app.use("/api/admin", adminRoutes);

// ✅ test route to confirm products route works
app.get("/api/products/test", (req, res) => {
  res.json({ success: true, message: "✅ Product routes are working!" });
});

// root route
app.get("/", (req, res) => res.send("Apps worked successfully"));

// ✅ global error handler (should be AFTER all routes)
app.use(globalErrorHandler);

// ✅ 404 handler should always be last
app.use((req, res) => {
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
});

// start server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

module.exports = app;
