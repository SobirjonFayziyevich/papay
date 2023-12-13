const ViewModel = require("../schema/view.model");
const MemberModel = require("../schema/member.model");
const ProductModel = require("../schema/product.model");
const BoArticleModel = require("../schema/bo_article.model");

class View {
  constructor(mb_id) {
    this.viewModel = ViewModel;
    this.productModel = ProductModel;
    this.memberModel = MemberModel;
    this.boArticleModel = BoArticleModel;
    this.mb_id = mb_id;
  }

  async validateChosenTarget(view_ref_id, group_type) { 
    try {
      let result;
      switch (group_type) { //switch argumenti group_type orqali kerakli kollekshinlardan izlaymiz.
        case "member":  // faqat memberlarni tomosha qiyayotganimz un member quyamiz.
          result = await this.memberModel  //memberSchema modelni chaqirayopmiz.
          .findOne({  // findOne mathodi ni urniga agarda findById mathodi bulsa, keyingi bosqichga xatolikni kursatmasdan utkazib yuboraveradi.
              _id: view_ref_id,
              mb_status: "ACTIVE",
            })
            .exec();
          break;     //result mavjud yoki  yuqligini qaytarishi kerak.

          case "product":  // faqat memberlarni tomosha qiyayotganimz un member quyamiz.
          result = await this.productModel  //memberSchema modelni chaqirayopmiz.
          .findOne({  // findOne mathodi ni urniga agarda findById mathodi bulsa, keyingi bosqichga xatolikni kursatmasdan utkazib yuboraveradi.
              _id: view_ref_id,
              product_status: "PROCESSx",
            })
            .exec();
          break;

          case "community":  // faqat memberlarni tomosha qiyayotganimz un member quyamiz.
          result = await this.boArticleModel  //memberSchema modelni chaqirayopmiz.
            .findOne({  // findOne mathodi ni urniga agarda findById mathodi bulsa, keyingi bosqichga xatolikni kursatmasdan utkazib yuboraveradi.
              _id: view_ref_id,
              art_status: "active",
            })
            .exec();
          break;
        }
      return !!result; // true va falesni qiymatini qaytaradigan syntax, resultni qiymatini tekshiradi.
    } catch (err) {
      throw err;
    }
  }

  async insertMemberView(view_ref_id, group_type) {
    try {
      const new_view = new this.viewModel({
        mb_id: this.mb_id,
        view_ref_id: view_ref_id, 
        view_group: group_type,
      });
      const result = await new_view.save();

      // target items view sonini bittaga oshiramiz
      await this.modifyItemViewCounts(view_ref_id, group_type);

      return result;
    } catch (err) {
      throw err;
    }
  }

  async modifyItemViewCounts(view_ref_id, group_type) {
    try {
      switch (group_type) {
        case "member":   //memberni sonini oshirish un tekshiradi
          await this.memberModel
            .findByIdAndUpdate(
              {
                _id: view_ref_id,
              },
              { $inc: { mb_views: 1 } }  // member viewni qiymatini oshirish kerak.
            )
            .exec();
          break;

          case "product":     //productni sonini oshirish un tekshiradi
            await this.productModel
              .findByIdAndUpdate(
                {
                  _id: view_ref_id,
                },
                { $inc: { product_views: 1 } }   // product viewni qiymatini oshirish kerak.
              )
              .exec();
            break;

            case "community":     //productni sonini oshirish un tekshiradi
            await this.boArticleModel
              .findByIdAndUpdate(
                {
                  _id: view_ref_id,
                },
                { $inc: { art_views: 1 } }   // product viewni qiymatini oshirish kerak.
              )
              .exec();
            break;
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  async checkViewExistence(view_ref_id) {
    try {
      const view = await this.viewModel
        .findOne({
          mb_id: this.mb_id,
          view_ref_id: view_ref_id,
        })
        .exec();
      return view ? true : false;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = View;