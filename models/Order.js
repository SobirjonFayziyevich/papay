
const assert = require("assert");
const { shapeIntoMongooseObjectId } = require("../lib/config");
const Definer = require("../lib/mistake");
const OrderModel = require("../schema/order.model"); // schemani ichidan order.modelni require qilib olayopmiz/
const OrderItemModel = require("../schema/order_item.model");


class Order {  
    constructor() {
        this.orderModel = OrderModel;
        this.orderItemModel = OrderItemModel;
    }

        async createOrderData(member, data) {
            try {
              let order_total_amount = 0, delivery_cost = 0; //uzgaruvchan qiymat bn hosil qilib olamiz.  
              const mb_id = shapeIntoMongooseObjectId(member._id);
              data.map(item => { //data malumotlarini map qilib olayopmiz.
                order_total_amount += item['quantity'] * item['price']; // order total amountni hisoblab olish maqsadim.
              }); 

              if(order_total_amount < 100) {  //shart quyaman. agar mijoz 100$ dan kup xarid qilsa yekazib berish tekin.
                 delivery_cost = 2; //yetkazib berish 2$ bulsin.
                 order_total_amount += delivery_cost; // zakaz qil summa va yetkazib berish summasini qushayopmiz.
       } 

       const order_id = await this.saveOrderData( // method bu;
         order_total_amount,
         delivery_cost,
         mb_id
       ); 
       console.log("order_id:::", order_id); //order_idni tekshirib olayopman. 
       //har bir order_itemsni creat qilganimyuq.


       //TODO: order items creation

          return order_id;
        } catch(err) {
          throw err;  
        }
    }
async saveOrderData(order_total_amount, delivery_cost, mb_id) {
    try {
        const new_order = new this.orderModel({
          order_total_amount: order_total_amount,
          order_delivery_cost: delivery_cost,
          mb_id: mb_id
        });
         const result = await new_order.save(); //mongoose beradigan xatoliklarni 
        assert.ok(result,Definer.order_err1);
        console.log("result:::", result);

      return result._id;
    } catch(err) {
      console.log(err);
      throw new Error(Definer.order_err1); 
    }
      
}



  }

  module.exports = Order;