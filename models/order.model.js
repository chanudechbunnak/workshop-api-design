const mongoose = require('mongoose');
const { Schema } = mongoose

const oderSchema = new Schema({
    order_id: { type: String }, 
    name: { type: String }, 
    address: { type: String },
    products: [
        {
            product_id: { type: Schema.Types.ObjectId, ref: 'product' }, 
            // product_name: { type: String },
            quantity: { type: Number } 
        }
    ],
    totalprice: { type: Number }, 
}, {
    timestamps: true
});

module.exports = mongoose.model('order', oderSchema);