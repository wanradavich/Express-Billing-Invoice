const mongoose = require('mongoose');
const Profile = require("./Profile");
const Product = require("./Product");
const invoiceSchema = new mongoose.Schema({
        profiles: {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
        invoiceNumber: {
            type: Number,
            required: true
        },
        invoiceDate: {
            type: Date,
            required: true
        },
        products: [{
            type: mongoose.Schema.Types.ObjectId, ref: "Product"
        }],
        quantities: [{
            type: Number
        }],
    },
    {
        collection: "invoices"
    }
);
const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;  