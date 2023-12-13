const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    productCode: {
        type: String,
        required: true,
    },
    unitCost: {
        type: Number,
        required: true,
    },
    quantity : {
        type: Number,
        required: false
    }
    },
    {collection: "products"}
);
const Product = mongoose.model("Product", productSchema);

module.exports = Product;