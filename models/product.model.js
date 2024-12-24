const mongoose = require('mongoose');
const { Schema } = mongoose

const productSchema = new Schema({
    product_id: { type: String },
    product_name: { type: String },
    detail: { type: String },
    price: { type: Number },
    stock: { type: Number },    
}, {
    timestamps: true
})

module.exports = mongoose.model('product', productSchema);