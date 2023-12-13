const InvoiceOps = require("../data/InvoiceOps");
const Invoice = require("../models/Invoice");
const _invoiceOps = new InvoiceOps();
const ProductOps = require("../data/ProductOps");
const _productOps = new ProductOps();
const ProfileOps = require("../data/ProfileOps");
const _profileOps = new ProfileOps();
const moment = require('moment');
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
    console.log(request.body);
    // loading the product object 
    // let productId = request.body.invoiceProduct;
    // let productObj = await _productOps.getProductById(productId);
    // console.log(productId);
    // console.log(productObj);

    // loading the profile object 
    let profileId = request.body.clientName;
    let profileObj = await _profileOps.getProfileById(profileId);

    const products = [];
    let totalDue = 0;

    for (let i = 0; i < request.body["productIds[]"].length; i++) {
      if (request.body["productIds[]"][i] == "0"){
        continue;
      }
      if (request.body["productIds[]"][i] == ""){
        continue;
      }
      let product = await _productOps.getProductById(request.body["productIds[]"][i]);
      if(request.body["productQuantities[]"][i] != ""){
        product.quantity = request.body["productQuantities[]"][i];
      }
      totalDue += product.unitCost * product.quantity;
      products.push(product);
    }

    let tempInvoiceObj = new Invoice({
      
      invoiceNumber: request.body.invoiceNumber,
      invoiceCompanyName: profileObj.name,
      //invoiceEmail: profileObj.email,
      invoiceProduct: products,
      invoiceDate: request.body.issueDate,
      invoiceDueDate: request.body.dueDate,
      // itemAmount: request.body.itemAmount,
      // itemRate: productObj.unitCost,
      invoiceTotalDue: totalDue,
      invoiceName: `Invoice # ${request.body.invoiceNumber} - ${profileObj.name}`
    });
    

    let responseObj = await _invoiceOps.createInvoice(tempInvoiceObj);

    if(responseObj.errorMsg == "") {
      //let products = await _productOps.getAllProducts();
      //let profiles = await _profileOps.getAllProfiles();
      let invoices = await _invoiceOps.getAllInvoices();
      console.log(responseObj.obj);
      response.render("invoices", {
        title: "Invoice",
        //products: products,
       // profiles: profiles,
        invoiceId: responseObj.obj._id.valueOf(),
        invoices: invoices
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
  let deletedProduct = await _invoiceOps.deleteInvoice(invoiceId);
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

