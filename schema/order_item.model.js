
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {order_status_enums} = require("../lib/config");

const orderItemSchema = new mongoose.Schema( // (OrderItemSchema Modeli). 
                                              //new mongoose.Schema classi.
    {
    item_quantity: {type: Number, required: true},
    item_price: {type: Number, required: true},
    order_id: {type: Schema.Types.ObjectId, ref: "Order", required: false}, //collectionlarni birlik nomi kerak shuni un  ORDERS emas, ORDER deb yozayopmiz.
    product_id: {type: Schema.Types.ObjectId, ref: "Product", required: false,
 },
},
{ timestamps: true }  //createdAT va updatedAt ni qabul qilayotgani un true bulayopti.
);

module.exports = mongoose.model("OrderItem", orderItemSchema); 