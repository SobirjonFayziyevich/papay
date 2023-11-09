const MemberModel= require("../schema/member.model");
const assert = require("assert");
const Definer = require("../lib/mistake");
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



}

module.exports = Restaurant;