const mongoose = require("mongoose");

exports.member_type_enums = ["USER", "ADMIN", "PEDAL", "RESTAURANT"];
exports.member_status_enums = ["ONPAUSE", "ACTIVE", "DELETED"];
exports.ordinary_enums = ["Y", "N"];

exports.product_collection_enums = ["dish", "salad", "dessert", "drink", "etc"];
exports.product_status_enums = ["PAUSED", "PROCESS", "DELETED"];
exports.product_size_enums = ["small", "large", "normal", "set"];
exports.product_volume_enums = [0.5, 1, 1.2, 1.5, 2];

exports.order_status_enums = ["PAUSED", "PROCESS", "FINISHED", "DELETED"];

exports.like_view_group_list = ["product", "member", "community"];
exports.board_id_enum_list = ["celebrity", "evaluation", "story"];
exports.board_article_status_enum_list = ["active", "deleted"];

/*****************************************
 *   MONGODB RELATED COMMANDS            *
 * @param {string} target
 *****************************************/

exports.shapeIntoMongooseObjectId = (target) => {
  if (typeof target === "string") {
    return new mongoose.Types.ObjectId(target);
  } else return target;
}; //  Agar "target" turi "string" bo'lsa, uni "mongoose" paketining "ObjectID" konstruktori orqali
// yangi "mongoose" ObjectID obyektiga o'zgartiradi va uni qaytaradi.
//Aks holda, yani "target" turining "string" bo'lmagan holatda, "target" ni o'z holatida qaytaradi.
// Bu yerga "mongoose" ObjectID obyekti kiritilmaydi.

exports.lookup_auth_member_following = (mb_id, origin) => {
  //aggregateQuery.push dagi (follow_idni mb_id qilib pass qilayopman.)
  const follow_id = origin === "follows" ? "$subscriber_id" : "$_id";

  return {
    $lookup: {
      from: "follows", //follows collectiondan lookup qilayopmiz.
      let: {
        //
        lc_follow_id: follow_id, //lc bu local .bular variablelar.
        lc_subscriber_id: mb_id, // teskari yozganimizning sababi,
        //follows collectionda follow_id teng bulishi kerak subscriber_idga,
        //subscriber_id bulsa, teng bulishi kerak mb_id ga yani follow_id ga.
        nw_my_following: true,
      },
      pipeline: [
        // pipeline syntaxsisi
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$follow_id", "$$lc_follow_id"] }, //follwsning ichidagi follow_idga equil bulayopti.
                { $eq: ["$subscriber_id", "$$lc_subscriber_id"] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            subscriber_id: 1,
            follow_id: 1, // 1 raqami projecttionga ol degani.
            my_following: "$$nw_my_following",
          },
        },
      ],
      as: "me_followed", //men follow bulganman sharti
    },
  };
};

exports.lookup_auth_member_liked = (mb_id) => {
  return {
    $lookup: {
      from: "likes",
      let: {
        lc_liken_item_id: "$_id",
        lc_mb_id: mb_id,
        nw_my_favorite: true,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$like_ref_id", "$$lc_liken_item_id"] },
                { $eq: ["$mb_id", "$$lc_mb_id"] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            mb_id: 1,
            like_ref_id: 1,
            my_favorite: "$$nw_my_favorite",
          },
        },
      ],
      as: "me_liked",
    },
  };
};
