const ProductOps = require("../data/ProductOps");
const _productOps = new ProductOps();
const Product = require("../models/Product.js");

exports.searchProducts = async function (req, res) {
  console.log("searching for products");
  const searchQuery = req.query.q;

  try {
    const products = await _productOps.find({
      productName: { $regex: searchQuery, $options: "i" },
    });

    res.render("products", {
      products: products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.Products = async function (request, response) {
  console.log("loading products from controller");
  let products = await _productOps.getAllProducts();
  if (products) {
    response.render("products", {
      title: "Express Billing - Products",
      products: products,
      layout: "layouts/full-width",
    });
  } else {
    response.render("products", {
      title: "Express Billing - Products",
      products: [],
    });
  }
};

exports.ProductDetail = async function (request, response) {
  const productId = request.params.id;
  console.log(`loading single product by id ${productId}`);
  let product = await _productOps.getProductById(productId);
  let products = await _productOps.getAllProducts();
  if (product) {
    response.render("productDetails", {
      title: "Express Yourself - " + product.productName,
      products: products,
      productId: request.params.id,
      layout: "./layouts/full-width",
    });
  } else {
    response.render("productsDetails", {
      title: "Express Yourself - Products",
      products: [],
    });
  }
};

exports.Create = async function (request, response) {
  response.render("product-form", {
    title: "Create Product",
    errorMessage: "",
    product_id: null,
    product: {},
  });
};

exports.CreateProduct = async function (request, response) {
  let tempProductObj = new Product({
    productName: request.body.productName,
    unitCost: request.body.unitCost,
    productCode: request.body.productCode,
  });

  let responseObj = await _productOps.createProduct(tempProductObj);

  if (responseObj.errorMsg == "") {
    let products = await _productOps.getAllProducts();
    console.log(responseObj.obj);
    response.render("products", {
      title: "Products",
      products: products,
      product_id: responseObj.obj._id.valueOf(),
    });
  } else {
    console.log("An error occured. Product was not created.");
    response.render("product-form", {
      title: "Create product",
      product: responseObj.obj,
      errorMessage: responseObj.errorMsg,
    });
  }
};

exports.Edit = async function (request, response) {
  const productId = request.params.id;
  let productObj = await _productOps.getProductById(productId);
  response.render("product-form", {
    title: "Edit Profile",
    errorMessage: "",
    product_id: productId,
    product: productObj,
  });
};

exports.EditProduct = async function (request, response) {
  const productId = request.body.product_id;
  const productObj = {
    productName: request.body.productName,
    unitPrice: request.body.unitCost,
    productCode: request.body.productCode,
  };

  console.log(`This is the product id${productId}`);

  let responseObj = await _productOps.updateProductById(productId, productObj);

  if (responseObj.errorMsg == "") {
    let products = await _productOps.getAllProducts();
    response.render("products", {
      title: "Products",
      products: products,
    });
  } else {
    console.log("An error occured. Item was not updated.");
    response.render("product-form", {
      title: "Edit Product",
      product: responseObj.obj,
      product_id: productId,
      errorMessage: responseObj.errorMsg,
    });
  }
};

exports.DeleteProductById = async function (request, response) {
  const productId = request.params.id;
  console.log(`deleting a single product by id ${productId}`);
  let deletedProduct = await _productOps.deleteProduct(productId);
  let products = await _productOps.getAllProducts();

  if (deletedProduct) {
    response.render("products", {
      title: "Products",
      products: products,
    });
  } else {
    response.render("products", {
      title: "Products",
      products: products,
      errorMessage: "Error. Could not delete product.",
    });
  }
};


