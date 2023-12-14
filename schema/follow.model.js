
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {} = require("../lib/config");

const followSchema = new mongoose.Schema(
    {
       follow_id: {type: Schema.Types.ObjectId, required: true}, //subscribe qilayotgan odam, kimga follow qilgan
       subscriber_id: {type: Schema.Types.ObjectId, required: true},  // buyerga bizning id yoziladi.
  },
{ timestamps: true } //createdAT va updatedAt ni qabul qilayotgani un true bulayopti.

);

followSchema.index( // compaund indexsitionni hosil qiladim.yani: databasega unic indexni kiritish.
    // bir vaqtni uzida follow_id va subscriber_id
    {follow_id: 1, subscriber_id: 1},
    {unique: true} // follow_id bn subscribe_id dan tashkil topgan birikma uniqe bulishi kerak.
);

module.exports = mongoose.model("Follow", followSchema); 