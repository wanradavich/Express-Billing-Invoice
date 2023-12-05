const InvoiceOps = require("../data/InvoiceOps");
const _invoiceOps = new InvoiceOps();
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
        title: "Express Yourself - " + invoice.invoiceName,
        invoices: invoices,
        invoiceId: request.params.id,
        layout: "layouts/full-width",
      });
    } else {
      response.render("invoiceDetails", {
        title: "Express Yourself - Invoices",
        products: [],
      });
    }
  };

// Handle profile form GET request
// exports.Create = async function (request, response) {
//   response.render("invoice-form", {
//     title: "Create Invoice",
//     errorMessage: "",
//     invoice: {},
//     layout: "layouts/full-width"
//   });
// }; 
  
//   exports.CreateProduct = async function (request, response) {
//     let tempProductObj = new Product({
//       productName: request.body.productName,
//       unitCost: request.body.unitCost,
//       productCode: request.body.productCode,
//     });
  
//     let responseObj = await _productOps.createProduct(tempProductObj);
  
//     if (responseObj.errorMsg == "") {
//       let products = await _productOps.getAllProducts();
//       console.log(responseObj.obj);
//       response.render("products", {
//         title: "Products",
//         products: products,
//         product_id: responseObj.obj._id.valueOf(),
//       });
//     } else {
//       console.log("An error occured. Product was not created.");
//       response.render("product-form", {
//         title: "Create product",
//         product: responseObj.obj,
//         errorMessage: responseObj.errorMsg,
//       });
//     }
//   };

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

