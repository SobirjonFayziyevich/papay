

const mongoose = require("mongoose"); // mongooseni chaqirib olayopmiz.
const {
    member_type_enums,
    member_status_enums,
    ordinary_enums,
} = require("../lib/config");


const memberSchema = new mongoose.Schema({ // (class deb nomladik) Schema yaratib olayopmiz.
    // (EAR modulingdagi)  member buyich malumotlarni joylashtirib chiqamiz.
    mb_nick: {
        type: String,
        required: true,
        index: {unique: true, sparse: true}, // kimdir ishlatgan nickni qayta ishlatsa xatoli deb chiqarishi un
    },
    mb_phone: {
        type: String,
        required: true,
        index: {unique: true, sparse: true},
    },
    mb_password: {
        type: String,
        required: false,
        select: false, // keyinchalik bydefault qilib qaytarmasligi un .
    },
    mb_type: {
        type: String,
        required: "RESTAURANT",
        default: "RESTAURANT",
        enum: {
            values: member_type_enums,
            message: "{VALUE} is not among permitted values" // valueni ichida bulmagan tashqaridan malumot kelsa xatolik bulsin.
        }
    },
    mb_status : {
        type: String,
        required: false,
        default: "ACTIVE",
        enum: {
            values: member_status_enums,
            message: "{VALUE} is not among permitted values" // valueni ichida bulmagan tashqaridan malumot kelsa xatolik bulsin.
        }
    },

    mb_address: {
        type: String,
        required: false,
    },
    mb_description: {
        type: String, required: false
    },
    mb_image: {
        type: String,
        required: false,
    },
    mb_point: {
        type: String,
        required: false,
        default: 0
    },
    mb_top: {
        type: String,
        required:false,
        default: "N",
        enum: {
            values: "N",   //enum bu oldindan belgilab olingan qiymat.
            message: "{VALUE} is not among permitted values"
        }
    },
    mb_views: {
        type: Number,
        required: false,
        default: 0
    },
    mb_likes: {
        type: Number,
        required: false,
        default: 0
    },
    mb_follow_cnt: {
        type: Number,
        required: false,
        default: 0
    },
    mb_subscriber_cnt: {
        type: Number,
        required: false,
        default: 0
    },
},
    {timestamps: true}  // createdAt  va updatedAt oladi.
);

// modelni shakillantirib oldik.
module.exports = mongoose.model("Member", memberSchema);
// member.model.jsdan qaytgan narsa bu model....

