// classlar orqali boglanayopti
const MemberModel = require("../schema/member.model"); // Schema modelni chaqirib olamiz.
const Definer = require("../lib/mistake");
const LikeModel = require("../schema/like.model");
const assert = require("assert");
const bcrypt = require("bcrypt");
const {
  shapeIntoMongooseObjectId,
  lookup_auth_member_following,
  lookup_auth_member_liked,
} = require("../lib/config");
const View = require("./View");
const Like = require("./Like");

class Member {
  constructor() {
    this.memberModel = MemberModel; // service model ichida schema model =dan foydalinyabdi
  }
  async signupData(input) {
    try {
      const salt = await bcrypt.genSalt();
      input.mb_password = await bcrypt.hash(input.mb_password, salt); // inputni ichidagi mb_paswordni uzgartirmoqchmiz,

      const new_member = new this.memberModel(input); // schema modeldan  class sifatida foydalanib uni ichida datani berib, yangi object hosil qilib
      let result;
      try {
        result = await new_member.save(); // u objectni ichida save methodan foydalangan holda memberni hosil qilamiz
        console.log(result);
      } catch (mongo_err) {
        console.log(mongo_err);
        throw new Error(Definer.mongo_validation_err1); //definer classsini yasab olamiz.
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
        .findOne({ mb_nick: input.mb_nick }, { mb_nick: 1, mb_password: 1 })
        .exec();
      // console.log("member:::", member);

      assert.ok(member, Definer.auth_err3); // user mavjud emas degan xatolik beradi.
      console.log(member);
      const isMatch = await bcrypt.compare(
        input.mb_password,
        member.mb_password
      );
      assert.ok(isMatch, Definer.auth_err4);

      return await this.memberModel //mb_nickni malumot olib orqaga qaytarib beradi.
        .findOne({ mb_nick: input.mb_nick })
        .exec();
    } catch (err) {
      throw err;
    }
  }

  async getChosenMemberData(member, id) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      id = shapeIntoMongooseObjectId(id);
      console.log("member:::", member);

      let aggregateQuery = [
        { $match: { _id: id, mb_status: "ACTIVE" } },
        { $unset: "mb_password" }, // mb_passwordni olib bermaydi
      ];

      if (member) {
        // condition not seen before.
        await this.viewChosenItemByMember(member, id, "member");
        aggregateQuery.push(lookup_auth_member_liked(auth_mb_id));
        //TODO: check auth member  likes the chosen member.
        aggregateQuery.push(
          lookup_auth_member_following(auth_mb_id, "members")
        );
      }

      const result = await this.memberModel.aggregate(aggregateQuery).exec();

      assert.ok(result, Definer.general_err2);
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  async viewChosenItemByMember(member, view_ref_id, group_type) {
    try {
      console.log("viewChosenItemByMember is working!!!");
      view_ref_id = shapeIntoMongooseObjectId(view_ref_id); //view_ref_idni mongooDB ID ga aylantirayopmiz.
      const mb_id = shapeIntoMongooseObjectId(member._id);

      const view = new View(mb_id);
      const isValid = await view.validateChosenTarget(view_ref_id, group_type); //biz kurayotgan memberimiz mavjudmi.
      console.log("isValid:::", isValid);
      //2chi memberlar haqiqiymi, 3- view logini hosil qildik 4- modifay qildik
      assert.ok(isValid, Definer.general_err2);

      //loged user has seen target

      const doesExist = await view.checkViewExistence(view_ref_id); //user oldin usha productni kurganmi?
      console.log("doesExist:::", doesExist); //agar user kursa keyingi bosqichga utmaydi.

      if (!doesExist) {
        // agar exit bulmasa inserMemberView mantiqini kiritayopmiz.((mavjud bulmagan vaqtda hechqanday qiymat qushilmaydi va modification bulmaydi.))
        const result = await view.insertMemberView(view_ref_id, group_type);
        assert.ok(result, Definer.general_err1);
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  async likeChosenItemByMember(member, like_ref_id, group_type) {
    try {
      console.log(" likeChosenItemByMember is working!!!!");
      like_ref_id = shapeIntoMongooseObjectId(like_ref_id); //view_ref_idni mongooDB ID ga aylantirayopmiz.
      const mb_id = shapeIntoMongooseObjectId(member._id);

      const like = new Like(mb_id);
      const isValid = await like.validateTargetItem(like_ref_id, group_type);
      console.log("isValid::::::", isValid);
      assert.ok(isValid, Definer.general_err2);
      // doesExit // like sonini 1taga oshirish mantiqi..
      const doesExist = await like.checkLikeExistence(like_ref_id);
      console.log("doesExist::", doesExist);

      // oldin like bosilmagan  bulsa likes bulishi kerak... target qiymati 1ga oshishi kerak.
      let data = doesExist // har ikki natijani dataga tenglashtirib oldim.
        ? await like.removeMemberLike(like_ref_id, group_type) // agar mavjud bulsa:
        : await like.insertMemberLike(like_ref_id, group_type); // agar mavjud bulmasa:
      assert.ok(data, Definer.general_err1);

      const result = {
        like_group: data.like_group,
        like_ref_id: data.like_ref_id,
        like_status: doesExist ? 0 : 1,
      };

      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateMemberData(id, data, image) {
    try {
      const mb_id = shapeIntoMongooseObjectId(id);

      let params = {
        mb_nick: data.mb_nick,
        mb_phone: data.mb_phone,
        mb_address: data.mb_address,
        mb_description: data.mb_description,
        mb_image: image ? image.path : null,
      };
      for (let prop in params) if (!params[prop]) delete params[prop]; //paramni ichidagi propsdan qiymatni ol, agar props bulmsa, paramdagi prosni uchir;
      const result = await this.memberModel
        .findOneAndUpdate(
          //pdate qilandan keyingi qymatlarni bersin
          { _id: mb_id },
          params,
          { runValidators: true, lean: true, returnDocument: "after" }
        )
        .exec();
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Member;
