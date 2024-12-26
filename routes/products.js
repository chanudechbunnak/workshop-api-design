var express = require("express");
var router = express.Router();
var productSchema = require("../models/product.model");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const tokenMiddleware = require('../middleware/token.middleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", async function (req, res, next) {
  let product = await productSchema.find({});
  res.send(product);
});

router.get("/:id", async function (req, res, next) {
  try {
    let { id } = req.params;
    let product = await productSchema.findById(id);
    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Error fetching Product by ID" });
  }
});

router.post("/", upload.single("image"), async function (req, res, next) {
  try {
    let latestProduct = await productSchema.findOne().sort({ product_id: -1 });
    let newProductId = "PD001";
    if (latestProduct && latestProduct.product_id) {
      let currentId = parseInt(latestProduct.product_id.substring(2));
      newProductId = "PD" + String(currentId + 1).padStart(3, "0"); 
    }

    let { product_name, detail, price, stock } = req.body;
    let product = new productSchema({
      product_id: newProductId,
      product_name: product_name,
      detail: detail,
      price: price,
      stock: stock,
    });

    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(500).send({ error: "Error creating product" });
  }
});

router.put("/:id", upload.single("image"), async function (req, res, next) {
  try {
    let { id } = req.params;
    let { product_id, product_name, detail, price, stock } = req.body;

    let product = await productSchema.findByIdAndUpdate(
      id,
      { 
        product_id: product_id, 
        image: req.file.filename,
        product_name: product_name, 
        detail: detail, 
        price: price, 
        stock: stock },
      { new: true }
    );

    res.send(product);
  } catch (error) {
    res.send(error);
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    let { id } = req.params;
    let product = await productSchema.findByIdAndDelete(id);

    res.send(product);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
