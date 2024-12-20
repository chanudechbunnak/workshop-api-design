var express = require('express');
var router = express.Router();
var orderSchema = require('../models/order.model');
const productSchema = require('../models/product.model');
const multer = require('multer');

router.get('/', async function(req, res, next) {
        let orders = await orderSchema.find({});
  res.send(orders);
});

router.get('/:id', async function(req, res, next) {
  try {
    let { id } = req.params;
    let order = await orderSchema.findById(id);
    if (order) {
      res.status(200).send(order);
    } else {
      res.status(404).send({ error: "order not found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Error fetching order by ID" });
  }
});

  // router.post('/', async function(req, res, next) {
  //   let { id, name, products, quantity} = req.body;
  //   let order = new orderSchema({
  //       id, name, products, quantity,     
  //   });
  
  //   // let token = await jwt.sign({foo: "bar"}, "2001")
  //   await order.save()
  //   res.send(order);
  // });

  router.post('/', async function (req, res, next ) {
    let { order_id, name, products } = req.body;

    if (!order_id) {
      let lastOrder = await orderSchema.findOne().sort({ createdAt: -1 }); // Get the last order based on creation time
      if (lastOrder && lastOrder.order_id) {
        let lastOrderId = parseInt(lastOrder.order_id.substring(3)); // Extract numeric part
        order_id = `ORD${(lastOrderId + 1).toString().padStart(3, '0')}`; // Increment and format
      } else {
        order_id = 'ORD001'; // Default for the first order
      }
    }
    
    let totalprice = 0;

    for (let i = 0; i < products.length; i++) {
      let { product_id, quantity } = products[i];
      let product = await productSchema.findById(product_id);
      let { stock } = product;
      stock -= quantity;
      if (stock < 0 ) {
        stock = 0;
      } 
      totalprice += product.price * quantity
      await productSchema.findByIdAndUpdate(product_id, { stock }, {new: true });
    }

    let order = new orderSchema({
      order_id,
      name,
      products,
      totalprice,
    });
    await order.save();
    res.send(order);
  })


module.exports = router;