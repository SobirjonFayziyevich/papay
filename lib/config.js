const mongoose = require("mongoose");

exports.member_type_enums = ["USER", "ADMIN", "PEDAL", "RESTAURANT"];
exports.member_status_enums = ["ONPAUSE", "ACTIVE", "DELETED"];
exports.ordinary_enums = ["Y", "N"];

exports.product_collection_enums = ["dish", "salad", "dessert", "drink", "etc"];
exports.product_status_enums = ["PAUSED", "PROCESS", "DELETED"];
exports.product_size_enums = ["small", "large", "normal", "set"];
exports.product_volume_enums = [0.5, 1, 1.2, 1.5, 2];

exports.like_view_group_list = ["product", "member", "community"]
exports.board_id_enum_list = ["celebrity", "evaluation", "story"]

/*****************************************
 *   MONGODB RELATED COMMANDS            *
 * @param {string} target
 *****************************************/

exports.shapeIntoMongooseObjectId = (target) => {
    if(typeof target === 'string') {
        return new mongoose.Types.ObjectId(target);
    } else return target;
}; //  Agar "target" turi "string" bo'lsa, uni "mongoose" paketining "ObjectID" konstruktori orqali
// yangi "mongoose" ObjectID obyektiga o'zgartiradi va uni qaytaradi.
//Aks holda, yani "target" turining "string" bo'lmagan holatda, "target" ni o'z holatida qaytaradi.
// Bu yerga "mongoose" ObjectID obyekti kiritilmaydi.

