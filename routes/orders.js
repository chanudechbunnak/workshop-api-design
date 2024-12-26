var express = require("express");
var router = express.Router();
var orderSchema = require("../models/order.model");
const productSchema = require("../models/product.model");

router.get("/", async function (req, res, next) {
  try {
    let orders = await orderSchema.find({}).populate('products.product_id', 'product_name detail');
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send({ error: "Error fetching orders" });
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    let { id } = req.params;
    let order = await orderSchema.findById(id).populate('products.product_id', 'product_name detail');
    if (order) {
      res.status(200).send(order);
    } else {
      res.status(404).send({ error: "Order not found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Error fetching order by ID" });
  }
});

router.post("/", async function (req, res, next) {
  let { order_id, name, address, products } = req.body;

  if (!order_id) {
    let lastOrder = await orderSchema.findOne().sort({ createdAt: -1 });
    if (lastOrder && lastOrder.order_id) {
      let lastOrderId = parseInt(lastOrder.order_id.substring(3));
      order_id = `ORD${(lastOrderId + 1).toString().padStart(3, "0")}`;
    } else {
      order_id = "ORD001";
    }
  }

  let totalprice = 0;

  for (let i = 0; i < products.length; i++) {
    let { product_id, quantity } = products[i];
    let product = await productSchema.findById(product_id);
    let { stock } = product;
    stock -= quantity;
    if (stock < 0) {
      stock = 0;
    }
    totalprice += product.price * quantity;
    await productSchema.findByIdAndUpdate(product_id, { stock }, { new: true });
 
    products[i].product_name = product.product_name;
  }

  let order = new orderSchema({
    order_id,
    name,
    address,
    products,
    totalprice,
  });

  await order.save();
  let populatedOrder = await orderSchema.findById(order._id).populate('products.product_id', 'product_name');
  
  res.send(populatedOrder);
});

module.exports = router;
