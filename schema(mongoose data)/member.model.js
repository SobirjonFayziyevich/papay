const mongoose = require("mongoose"); // mongooseni chaqirib olayopmiz.

const memberSchema = new mongoose.Schema({ // Schema yaratib olayopmiz.
    // (EAR modulingdagi)  member buyich amlumotlarni joylashtirib chiqamiz.
    mb_nick: {
        type: String,
        required: true,
        index: {unique: true, sparse: true} // kimdir ishlatgan nickni qayta ishlatsa xatoli deb chiqarishi un
    },
    mb_phone: {
        type: String,
        required: true,
    },
    mb_password: {
        type: String,
        required: true,
        select: false // keyinchalik bydefault qilib qaytarmasligi un .
    },
    mb_type: {
        type: String,
        required: false,
        default: "USER",
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
        required: false
    },
    mb_description: {
        type: String, required: false
    },
    mb_image: {
        type: String,
        required: false
    },
    mb_point: {
        type: Number,
        required: false,
        default: "N"
    },
    mb_top: {
        type: string,
        required:false,
        default: "N",
        enum: { //enum bu oldindan belgilab olingan qiymat.
            values: "{VALUE} is not among permitted vlues"
        },
    },
    mb_views: {
        type: Number;
        required: false;
        default: 0
    },
    mb_likes: {
        type: Number;
        required: false;
        default: 0
    },
    mb_follow_cnt: {
        type: Number;
        required: false;
        default: 0
    },
    mb_subscriber_cnt: {
        type: Number;
        required: false;
        default: 0
    },
    {timestamps: true} // createdAt  va updatedAt oladi.
});

// modelni shakillantirib oldik.
module.exports = mongoose.model("Member", memberSchema);
// member.model.jsdan qaytgn narsa bu model....

