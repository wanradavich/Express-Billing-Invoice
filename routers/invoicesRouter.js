const express = require("express");
const invoicesRouter = express.Router();
const invoiceController = require("../controllers/invoiceController");

invoicesRouter.get("/", invoiceController.Invoices);



module.exports = invoicesRouter;