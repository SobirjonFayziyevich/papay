const MemberModel= require("../schema/member.model");
const assert = require("assert");
const Definer = require("../lib/mistake");
const {shapeIntoMongooseObjectId}=require("../lib/config");
class Restaurant {
    constructor() {
        this.memberModel = MemberModel;      // memberSchema modelni chaqirib oladmiz.
    }
    async getAllRestaurantsData() {
        try {
            let result = await this.memberModel
                .find({                // schema member modelimizning (find) static
                mb_type: "RESTAURANT",  // classdan foydalanib typelarni chaqiramiz.
                }).exec();
            assert( result, Definer.general_err1 );              // shart quyamiz.resta userlarimizni olib kelishda
               return result; //qiymat qaytarsa return qilaman.  // mavjud qiymat qaytarmasa definerdan xatolikni yuboramiz.

        } catch(err) {
            throw err;

        }
    }

    async updateRestaurantByAdminData(update_data) {
        try {
            const id = shapeIntoMongooseObjectId(update_data?.id); // update_datani ichida (id)mizni mongodb object kurinishiga keltirib olamiz.
            const result = await this.memberModel
                .findByIdAndUpdate({ _id: id },update_data, {
                    runValidators: true,
                    lean: true,
                    returnDocument: "after",
                })  //update bulgandan keyingi qiymatni bersin.
            .exec();

         assert.ok(result,Definer.general_err1);
         return result;
        } catch(err) {
          throw err;
        }

    };



}

module.exports = Restaurant;