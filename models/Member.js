


// classlar orqali boglanayopti
const MemberModel = require("../schema/member.model");       // Schema modelni chaqirib olamiz.
const Definer = require("../lib/mistake");
const assert = require("assert");
const bcrypt = require("bcrypt");
const { shapeIntoMongooseObjectId } = require("../lib/config");
const View = require("./View");


class Member{
    constructor() {
        this.memberModel = MemberModel;   // service model ichida schema model =dan foydalinyabdi
    }
    async signupData(input) {
        try {

            const salt = await bcrypt.genSalt();
            input.mb_password = await bcrypt.hash(input.mb_password, salt);    // inputni ichidagi mb_paswordni uzgartirmoqchmiz,

            const new_member = new this.memberModel(input);  // schema modeldan  class sifatida foydalanib uni ichida datani berib, yangi object hosil qilib
             let result;
            try {
                result = await new_member.save();   // u objectni ichida save methodan foydalangan holda memberni hosil qilamiz
                console.log(result);
            } catch (mongo_err) {
                console.log(mongo_err);
                throw new Error(Definer.auth_err1);                            //definer classsini yasab olamiz.
            }
            result.mb_password = "";
            return result;
        } catch (err) {
            throw err;
        }
    }

    async loginData(input) {
        try {
            const member = await this.memberModel
                .findOne(
                    { mb_nick: input.mb_nick },
                    { mb_nick: 1, mb_password: 1 })
                .exec();
            // console.log("member:::", member);

                 assert.ok(member, Definer.auth_err3);  // user mavjud emas degan xatolik beradi.
                 console.log(member);
                 const isMatch = await bcrypt.compare(
                     input.mb_password,
                     member.mb_password
                 );
                 assert.ok(isMatch, Definer.auth_err4);

                 return await this.memberModel  //mb_nickni malumot olib orqaga qaytarib beradi.
                     .findOne({mb_nick: input.mb_nick})
                     .exec();
        } catch (err) {
            throw err;
        }
    }

    async getChosenMemberData(member, id) {
        try {
            id = shapeIntoMongooseObjectId(id);
            
             console.log("member:::", member);

             if(member) {
                 // condition not seen before.
              await this.viewChosenItemByMember(member, id, "member");
             }

            const result = await this.memberModel
            .aggregate([   //
                { $match: { _id: id, mb_status: "ACTIVE" } },
               { $unset: "mb_password"},        // mb_passwordni olib bermaydi
        ])
         .exec();

         assert.ok(result, Definer.general_err2);
        return result[0];
        } catch (err) {
          throw err;
        }
    }

    async viewChosenItemByMember (member, view_ref_id, group_type) {
        try {
            view_ref_id = shapeIntoMongooseObjectId(view_ref_id); //view_ref_idni mongooDB ID ga aylantirayopmiz.
            const mb_id = shapeIntoMongooseObjectId(member._id);
          
            const view = new View(mb_id);
             const isValid = await view.validateChosenTarget(view_ref_id, group_type);
            assert.ok(isValid, Definer.general_err2 );

            //loged user has seen target
            const doesExist = await view.checkViewExistance(view_ref_id);
            console.log("doesExist:", doesExist);
            if(!doesExist) { //mavjud bulmagan vaqtda 
            const result = await view.insertMemberView(view_ref_id, group_type);
            assert.ok(result, Definer.general_err1);
            } 
           return true;
           
        } catch (err) {
          throw err;
        }
    }
}

module.exports = Member;