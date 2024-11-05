const Brand = require("../model/Brand");
const productServices = require("../services/product.service");
const Product = require("../model/Products");
const mongoose = require("mongoose");

// add product
exports.addProduct = async (req, res, next) => {
  console.log("product--->", req.body);
  try {
    // Convert 'brand.id' and 'category.id' to ObjectId before saving
    const brandId = mongoose.Types.ObjectId(req.body.brand?.id);
    const categoryId = mongoose.Types.ObjectId(req.body.category?.id);

    // Convert 'reviews' array to ObjectId if it's an array
    const reviews = req.body.reviews?.map((reviewId) =>
      mongoose.Types.ObjectId(reviewId)
    );

    const firstItem = {
      color: {
        name: "",
        clrCode: "",
      },
      img: req.body.img,
    };

    // Add imageURLs, which is an array, to the product data
    const imageURLs = [firstItem, ...req.body.imageURLs];

    // Create the product data with the converted ObjectId fields
    const productData = {
      ...req.body,
      brand: { id: brandId }, // Use ObjectId for brand
      category: { id: categoryId }, // Use ObjectId for category
      reviews, // Reviews array already contains ObjectIds
      imageURLs, // Including imageURLs
    };

    // Pass productData to the service layer to handle saving
    const result = await productServices.createProductService(productData);

    console.log("product-result", result);

    // Respond with a success message
    res.status(200).json({
      success: true,
      status: "success",
      message: "Product created successfully!",
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// add all product
module.exports.addAllProducts = async (req, res, next) => {
  try {
    const result = await productServices.addAllProductService(req.body);
    res.json({
      message: "Products added successfully",
      result,
    });
  } catch (error) {
    next(error);
  }
};

// get all products
exports.getAllProducts = async (req, res, next) => {
  try {
    const result = await productServices.getAllProductsService();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// get all products by type
module.exports.getProductsByType = async (req, res, next) => {
  try {
    const result = await productServices.getProductTypeService(req);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// get offer product controller
module.exports.getOfferTimerProducts = async (req, res, next) => {
  try {
    const result = await productServices.getOfferTimerProductService(
      req.query.type
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// get Popular Product By Type
module.exports.getPopularProductByType = async (req, res, next) => {
  try {
    const result = await productServices.getPopularProductServiceByType(
      req.params.type
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// get top rated Products
module.exports.getTopRatedProducts = async (req, res, next) => {
  try {
    const result = await productServices.getTopRatedProductService();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// getSingleProduct
exports.getSingleProduct = async (req, res, next) => {
  try {
    const product = await productServices.getProductService(req.params.id);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// get Related Product
exports.getRelatedProducts = async (req, res, next) => {
  try {
    const products = await productServices.getRelatedProductService(
      req.params.id
    );
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// update product
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await productServices.updateProductService(
      req.params.id,
      req.body
    );
    res.send({ data: product, message: "Product updated successfully!" });
  } catch (error) {
    next(error);
  }
};

// update product
exports.reviewProducts = async (req, res, next) => {
  try {
    const products = await productServices.getReviewsProducts();
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// update product
exports.stockOutProducts = async (req, res, next) => {
  try {
    const products = await productServices.getStockOutProducts();
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// update product
exports.deleteProduct = async (req, res, next) => {
  try {
    await productServices.deleteProduct(req.params.id);
    res.status(200).json({
      message: "Product delete successfully",
    });
  } catch (error) {
    next(error);
  }
};
