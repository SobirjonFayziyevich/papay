
const assert = require("assert");
const {shapeIntoMongooseObjectID} = require("../lib/config");   // Product Schemani export qilib oldik.
const Definer = require("../lib/mistake");
const ProductModel = require("../schema/product.model");


            // MANTIQ:
    // ProductServiceModel => ProductControllerga xizmat qiladi. C => M (product service model ) => SchemaModel (DATA BASE model);
    // SchemaModellar => Product Model Service un xizmat qiladigam model hisoblanadi.
    // Service Modellar => Product Controller un xizmat qiladigan model hisoblandai.

class Product {
    constructor() {
        this.productModel = ProductModel;  //bydefaul ProductModel classni hosil qilib (ProductModel)ga tenglashtirayopti.
    }
    async addNewProductData(data, member) {   // method yasab oldik.
        try {
           data.restaurant_mb_id = shapeIntoMongooseObjectID(member._id); // memberIDni  MONGODB ObjectID aylantirilmoqda member._id ichidan.


            const new_product = new this.productModel(data);  // bu schema model
            const result = await new_product.save();

            assert.ok(result, Definer.product_err1);
            return result;
          } catch (err) {
            throw err;
         }
    }
}

module.exports = Product;