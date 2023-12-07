const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
        invoiceNumber: {
            type: Number,
            required: true
        },
        invoiceName: {
            type: String,
            required: true
        },
        invoiceCompanyName: {
            type: String,
            required: true
        },
        invoiceProduct: {
            type: String,
            required: true
        },
        invoiceDate: {
            type: Date,
            required: true
        },
        invoiceTotalDue: {
            type: Number,
            required: true
        },
        invoiceDueDate: {
            type: Date,
            required: true
        },
        itemRate: {
            type: Number,
            required: true
        },
        itemAmount:{
            type: Number,
            required: true
        },
        lineItems: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                quantity: Number,
              }
        ]
    },
    {
        collection: "invoices"
    }
);
const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;