
const assert = require("assert");
const {shapeIntoMongooseObjectId} = require("../lib/config");   // Product Schemani export qilib oldik.
const Definer = require("../lib/mistake");
const ProductModel = require("../schema/product.model");


            // MANTIQ:
    // ProductServiceModel => ProductControllerga xizmat qiladi. C => M (product service model ) => SchemaModel (DATA BASE model);
    // SchemaModellar => Product Model Service un xizmat qiladigam model hisoblanadi.
    // Service Modellar => Product Controller un xizmat qiladigan model hisoblandai.

class Product {
    constructor() {
        this.productModel = ProductModel;  // ProductModel classni hosil qilib (ProductModel)ga tenglashtirayopti.
    }
    //restaurantControllerdan kelayotgan malumotni shuyerga kiritayopmiz.
    async getAllProductsDataResto(member) {
        try {
            member._id = shapeIntoMongooseObjectId(member._id);      // mongodb object ga aylantirib olayopmiz (DATABASE)
         const result = await this.productModel.find({        // mongodb id qidirayopmiz.
           restaurant_mb_id: member._id,                             // restaurant_mb_id teng bulsin, member_idga tenglashtirib olayopmiz
         });
         assert.ok(result, Definer.general_err1);                    // member id topish muammo bulsa error hosil qilsin.(hechqanday data qaytganda ishga tushadi)
            return result;
            // console.log("result:", result);                       // resultni tekshirib oldim.
        } catch(err) {
          throw err;
        }
    }







    async addNewProductData(data, member) {    // method yasab oldik.
        try {
           data.restaurant_mb_id = shapeIntoMongooseObjectId(member._id); // memberIDni  MONGODB ObjectID aylantirilmoqda member._id ichidan.


            const new_product = new this.productModel(data);  // bu schema model instins olayopmiz
            const result = await new_product.save();       //

            assert.ok(result, Definer.product_err1);

            return result;
          } catch (err) {
            throw err;
         }
    }


    async updateChosenProductData(id, updated_data, mb_id) {   // method yasab oldik.
        try {
              id = shapeIntoMongooseObjectId(id);      // memberIDni  MONGODB ObjectID aylantirilmoqda _id ichidan.
             mb_id = shapeIntoMongooseObjectId(mb_id);

            const result = await this.productModel.findOneAndUpdate(
                {_id: id, restaurant_mb_id: mb_id},   // 1chi object filtering buladi qaysi objectda update qilmoqchisz.
                                                           // id === id, restaurant mb_idsi === mb_idga.
                updated_data,                              // uzgartirmoqchi bulgan data yozamiz.
                {
                    runValidators: true,  //uzgargan datani yuborsa.bularni yozishimizdan sabab uzgargan qiymatni kurmoqchiman.
                    lean: true,
                    returnDocument: "after", //yangilangan data ni bizga beradi

                    // runValidators: true,  //uzgargan datani yuborsa.bularni yozishimizdan sabab uzgargan qiymatni kurmoqchiman.
                    // lean: true,
                    // returnDocument: "before",  // eski data ni beradi.
                }
                ).exec();

            assert.ok(result, Definer.general_err1);  //natijani tekshiramiz. agar malumotimiz uptade bulmagan bulsa, xatolikni chiqarsin.
            return result;                             // hammasi ajoyib bulgan bulsa return qilsin.
          } catch (err) {
            throw err;
        }
    }
}

module.exports = Product;