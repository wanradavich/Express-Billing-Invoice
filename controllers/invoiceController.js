const InvoiceOps = require("../data/InvoiceOps");
const Invoice = require("../models/Invoice");
const _invoiceOps = new InvoiceOps();
const ProductOps = require("../data/ProductOps");
const _productOps = new ProductOps();
const ProfileOps = require("../data/ProfileOps");
const _profileOps = new ProfileOps();
// const Invoice = require("../models/Invoice.js");

exports.searchInvoice = async function (req,res) {
    console.log("searching for invoices..");
    const searchQuery = req.body.q

    try{
        const invoices = await _invoiceOps.find({
            invoiceName: {$regex: searchQuery, $options: "i"},
        });

        res.render("invoices", {
            invoices: invoices
        });
    } catch (error){
        res.status(500).json({ error: error.message });
    }
}

exports.Invoices = async function (request, response) {
    console.log("loading invoices from controller");
    let invoices = await _invoiceOps.getAllInvoices();
    if (invoices) {
      response.render("invoices", {
        title: "Invoices",
        invoices: invoices,
        layout: "layouts/full-width",
      });
    } else {
      response.render("invoices", {
        title: "Express Billing - Invoices",
        invoices: [],
      });
    }
  };
  
  exports.InvoiceDetail = async function (request, response) {
    const invoiceId = request.params.id;
    console.log(`loading single invoice by id ${invoiceId}`);
    let invoice = await _invoiceOps.getInvoiceById(invoiceId);
    let invoices = await _invoiceOps.getAllInvoices();
    if (invoice) {
      response.render("invoiceDetails", {
        title: "Express Yourself - " + invoice.invoiceNumber,
        invoices: invoices,
        invoiceId: request.params.id,
        layout: "layouts/full-width",
      });
    } else {
      response.render("invoiceDetails", {
        title: "Express Yourself - Invoices",
        invoices: [],
      });
    }
  };

  exports.Create = async function (request, response) {
    let products = await _productOps.getAllProducts();
    console.log(products);
    let profiles = await _profileOps.getAllProfiles();
    response.render("invoice-form", {
      title: "Create Invoice",
      errorMessage: "",
      invoice_id: null,
      invoice: {},
      products: products,
      profiles: profiles
    });
  };

  exports.CreateInvoice = async function (request, response) {
    let productId = request.body.invoiceProduct;
    let productObj = await _productOps.getProductById(productId);
    console.log(productId);
    console.log(productObj);
    let profileId = request.body.clientName;
    let profileObj = await _profileOps.getProfileById(profileId);
    let tempInvoiceObj = new Invoice({
      invoiceNumber: request.body.invoiceNumber,
      invoiceCompanyName: profileObj.name,
      invoiceProduct: productObj.productName,
      invoiceDate: request.body.issueDate,
      invoiceDueDate: request.body.dueDate,
      itemAmount: request.body.itemAmount,
      itemRate: productObj.unitCost,
      invoiceTotalDue: itemRate * itemAmount
    });

    let responseObj = await _invoiceOps.createInvoice(tempInvoiceObj);

    if(responseObj.errorMsg == "") {
      let products = await _productOps.getAllProducts();
      let profiles = await _profileOps.getAllProfiles();
      console.log(responseObj.obj);
      response.render("invoiceDetails", {
        title: "Invoice",
        products: products,
        profiles: profiles,
        invoiceId: responseObj.obj._id.valueOf()
      });
    } else {
      console.log("An error occured. Invoice was not created.");
      response.render("invoice-form", {
        title: "Create Invoice",
        invoice: responseObj.obj,
        errorMessage: responseObj.errorMsg
      });
    }
  };

exports.DeleteInvoiceById = async function (request, response) {
  const invoiceId = request.params.id;
  console.log(`deleting a single invoice by id ${invoiceId}`);
  let deletedProduct = await _invoiceOps.deleteProduct(invoiceId);
  let invoices = await _invoiceOps.getAllInvoices();

  if (deletedProduct) {
    response.render("invoices", {
      title: "Invoices",
      invoices: invoices,
    });
  } else {
    response.render("invoices", {
      title: "Invoices",
      invoices: invoices,
      errorMessage: "Error. Could not delete invoice.",
    });
  }
};

