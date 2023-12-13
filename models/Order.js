const assert = require("assert");
const { shapeIntoMongooseObjectId } = require("../lib/config");
const Definer = require("../lib/mistake");
const OrderModel = require("../schema/order.model"); // schemani ichidan order.modelni require qilib olayopmiz/
const OrderItemModel = require("../schema/order_item.model");



class Order {  
    constructor() {
        this.orderModel = OrderModel;
        this.OrderItemModel = OrderItemModel;
    }

        async createOrderData(member, data) {
            try {
              let order_total_amount = 0, 
              delivery_cost = 0; //uzgaruvchan qiymat bn hosil qilib olamiz.  
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
       // await bulgani un database Schema model bn birga ishlaydigan mathod bulgani un.
    await this.recordOrderItemsData(order_id, data); //recordOrderItemsData mathodi orqali har bir productga tegishli bulgan order_itemsni hosil qildik.
          return order_id;
        } catch(err) {
          throw err;  
        }
    }

async saveOrderData(order_total_amount, delivery_cost, mb_id) {
    try {
        const new_order = new this.orderModel({  
          order_total_amount: order_total_amount,   //mongooDBni validation xatoligi sodir bulishi mumkin.
          order_delivery_cost: delivery_cost,
          mb_id: mb_id,
        });
         const result = await new_order.save(); //mongoose beradigan xatoliklarni 
        assert.ok(result,Definer.order_err1);

        // console.log("result:::", result);

      return result._id;
    } catch(err) {
      console.log(err);   // mongoDB dagi xatolikni chaqirib olayopmiz.
      throw new Error(Definer.order_err1); 
    }
  }

  
  async recordOrderItemsData(order_id, data) { //
      try { //mapning ichida (promist list maxsus syntax hisoblandi) pro_listlarni yasab olib, async return qilamn.
         const pro_list = data.map(async (item) => {  // datani har bir elementini map qilib,item orqali har birini qiymatlarini olaman.
            return await this.saveOrderItemsData(item, order_id);   //yangi mathod yasab olib ichiga item va order_id yubodim.
         });
          
         //Promise.all syntaxsimiz pro_list arrayimizni  harbirini oxirigacha yakunlanishini taminlab beradi.
         const results = await Promise.all(pro_list); // pro_listdagi jarayon tugamaguncha kut degan jarayon, hammasini tugashini kutish syntaxsisi
         console.log("results:::", results ); 
         return true;

      } catch(err) {
         throw err; 
      }
  }
async saveOrderItemsData(item, order_id) { // buyerda birma bir DataBasega save qilaman.
   try{
     order_id = shapeIntoMongooseObjectId(order_id); //order_id ni shaping qilib oladim
     item._id = shapeIntoMongooseObjectId(item._id); //item_idni shaping qilib olayopman.

     const order_item = new this.OrderItemModel({
      item_quantity: item['quantity'],
      item_price: item['price'], 
      order_id: order_id,
      product_id: item['_id'],
     });

     const result = await order_item.save();
     assert.ok(result, Definer.order_err2);

     return 'inserted'; // logikamiz muvaffaqiyatli bulsa, created deb javob qaytadi.
   } catch(err) {
    console.log(err);
    throw new Error(Definer.order_err2);  
   }
  }



async getMyOrdersData(member, query) {
  try {
     const mb_id = shapeIntoMongooseObjectId(member._id),
     order_status = query.status.toUpperCase(),
     //order_statusni belgilab olib, Query objectini ichidan statusni qabul qilib oldim,va toUpperCase mathoddan foydalandim.
     matches = { mb_id: mb_id, order_status: order_status }; //matches aggregationimiz un kerak buladigan object,

     const result = await this.orderModel
     .aggregate([
       { $match: matches }, //mb_id va mb_statuslarni aggregat qilib ber.
       { $sort: { createdAt: -1 } }, //oxirgi orderlarimni kursat deyopman.
       //$match va$sortdan hosil bulgan qiymatlar array kurinishida.
       {
        $lookup: {
           from: "orderitems", //orderItemsda qaysi mahsulotlar icjida mavjudligi haqidagi malumotlar buladi.
           localField: "_id", //mogoodbdagi order_Itemsning object Idsini olayopman. va shu Id ga tengdir.
           foreignField: "order_id",   //foreignField bu => orderItemsga tegishli bulgan Field hisoblanadi.
           // Object ichidan Idni olib ForeignFielddan izlasin.
           as: "order_items",  //datani qabul qilish usulli.
         },
       },

        { 
        $lookup: {
          from: "products",
          localField: "order_items.product_id",
          foreignField: "_id",
          as: "product_data", //datani qabul qilish usulli.
        }, 
      },
     ])

     .exec();
     console.log("result:::", result);
     return result;
  } catch (err) {
    throw err;
  }
 }

async editChosenOrderData(member, data) {  // bu mathodga member va body qismdagi data kelayopti.
  try {
     const mb_id = shapeIntoMongooseObjectId(member._id), //shaping usulidan foydalanayopman.
     order_id = shapeIntoMongooseObjectId(data.order_id), //datani ichidan past bulayopti (yani req. bodydan kelayopti)
     order_status = data.order_status.toUpperCase(); //order_statusimni datani ichidagi statusga tenglashtirib olib, toUpperCase mathodidan foydalandim.

     const result = await this.orderModel.findOneAndUpdate( //schema modelini hosil qilib,findOneAndUpdate mathodini chaqirib olayopmiz.
      //bizga endi 3ta object kerak. 
      // mb_id ,order_status, runValidators objectlaridan foydalanamiz.
       {mb_id: mb_id, _id: order_id}, //mb_id mb_idga teng, id => order_id teng bulishi kerak.
       {order_status: order_status}, //authenticat bulgan userning ichidagi datasidan olayopmiz.
       {runValidators: true, lean: true, returnDocument: 'after' }  
       );      // returnDocument => o'zgargan qiymatlarini yubor.

        console.log(result);
        assert.ok(result, Definer.order_err3); // umumiy qiymatni kursat
        
        return result;

     } catch (err) {
       throw err;
     }
   }

   
}

  module.exports = Order;