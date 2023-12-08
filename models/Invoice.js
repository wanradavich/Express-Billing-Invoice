const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
        invoiceName: {
            type: String,
            required: true
        },
        invoiceNumber: {
            type: Number,
            required: true
        },
        invoiceCompanyName: {
            type: String,
            required: true
        },
        invoiceEmail: {
            type: String,
            required: true
        },
        invoiceProduct: {
            type: String,
            required: true
        },
        invoiceDate: {
            type: String,
            required: true
        },
        invoiceTotalDue: {
            type: Number,
            required: true
        },
        invoiceDueDate: {
            type: String,
            required: true
        },
        itemRate: {
            type: Number,
            required: true
        },
        itemAmount:{
            type: Number,
            required: true
        } 
    },
    {
        collection: "invoices"
    }
);
const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;