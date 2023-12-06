const MemberModel= require("../schema/member.model");
const assert = require("assert");
const Definer = require("../lib/mistake");
const {shapeIntoMongooseObjectId}=require("../lib/config");
const Member = require("../models/Member");



class Restaurant {
    constructor() {
        this.memberModel = MemberModel;      // memberSchema modelni chaqirib oladmiz.
    }

    async getRestaurantsData(member, data) { // member va data parametrlarini qabul qiladi.
        try {
            const auth_mb_id = shapeIntoMongooseObjectId(member?._id);  //kim login bulib, req qilayotgan bulsa,shuni member_id kerak.
                                                         //member?._id mavjud bulsa.
             let match = {mb_type: "RESTAURANT", mb_status: "ACTIVE"}; //match uzgaruvchi objectni hosil qilib olayopman  
           // enum mb_type: RESTAURANT bulgan, statusi ACTIVE bulgan restaurantlarni olib ber deyopman. ACTIVE bulmaganlarini qabul qilmaydi. 

           //aggregationQuery arrayini hosil qilib, 
           //sababi aggregate ichida query ishlatayopmiz shuyerga pass qilish maqsadida yozayopman. 
           let aggregationQuery = [];     
           data.limit = data["limit"] * 1; //data limiti string kurinishi kelayopti biz songa aylantib olamiz.                                              
           data.page = data["page"] * 1;
//data.order orqali bitta get rest API bn barcha restarantlar,top rest,zo'r rest olaman , alohida yozib utirmayman.
           switch(data.order) { //datani ichida kelayotgan orderning qiymatiga swich qilayopman.
               case 'top':      // agar top restaurantlar suralganda ordering bulmasligi kerak.
                   match["mb_top"] = "Y"; //matchni ichida mb_topning qiymatida,(enum qiymat) YES bulishi kerak. 
                   aggregationQuery.push({ $match: match }); // array bulgani un (match objectimni) mongoDbni match buyrug'iga tenglashtib push qilayopman.
                   aggregationQuery.push ({ $sample: {size: data.limit } }); // arrayga sample syntaxni kiritib,random shaklini tanlaydi bizning limitimizdan kelib chiqqan  holada.
                    // data.limitga bosh sahafadagi 4ta resta berilgan bulsa, 4 ta rest ololadi.agarda 8 ta bulsa,4tasini olib keyingi pagega qolgan qismini utkazib yuboradi.
                   break;
                   case "random": // agar random string kelsa, u holda bu operatsiyani amalga oshir.
                   aggregationQuery.push({ $match: match }); //birxil restarantlar chiqishidan qattiy nazar(like,viewlardan qattiy nazar) harbiriga birxil huquq beramiz. 
                   aggregationQuery.push ({ $sample: {size: data.limit } });
                       break;
                    default:     // agar (default) hollarda,
                    aggregationQuery.push({ $match: match }); //aggregationQueryni ichiga match syntax un match objecti provite qilyopmiz.
                    const sort = {[data.order]: -1};    // sort objectini ichida,(elementlar harxil qiymatni hosil qilib olishi mumkin) shuning un array kurinishidagi syntaxni hosil qilib olayopman, 
                    // eng oxirgi qushilgan restaurantlar.
                    aggregationQuery.push({ $sort: sort }); //sort syntaxga sort obejectimizni tenglashtirib olamiz.
                        break;  //biz nima uchun order qiymatiga top bn randomni kiritishimiz kerak?
           }

           aggregationQuery.push({$skip: (data.page - 1) * data.limit});// har 3lasiga tegishli bulgan Quary nimalardan iborat.
           //datani ichidan 1chi page qiymatni qabul qilib, har bitta qilgan req nechta data kelishi kerakligini anglatadi.
           aggregationQuery.push({ $limit: data.limit }); // mongodbni limit buyruqi asosida shakillantirib olayopmiz.
           //qiymati bulsa,Querydan kelayotdan DATA objectining limit elementiga tenglashtirib olayopmiz.


            //TODO: check auth member  likes the chosen target. (harbir restarantga like bosganmizmi yuqmi?) metodini yasaymn.

           const result = await this.memberModel.aggregate(aggregationQuery).exec();
           // memberSchema modeldan aggregate qilamiz, va aggregatening qiymatiga aggregationQueryni argument sifatida past qildim. 
           assert.ok(result, Definer.general_err1);
           return result;

        } catch (err) {
           throw err; 
        }

    };

    async getChosenRestaurantData(member, id) {
        try {
            id = shapeIntoMongooseObjectId(id);  //idni shape qilayopmiz.yani mongDB objectiga ugirib olmoqchiman.

            if(member) {   //agar loged bulmagan user bulmasa bu qatnashmaydi.
                const member_obj = new Member();   //Product Service modelni ichida Member Service modelni ishkatayopmizz.
                await member_obj.viewChosenItemByMember(member, id, "member");  //member => kim, id => nima, product => type bulayopti.
            }

            const result = await this.memberModel.findOne({
                _id: id,
                mb_status: "ACTIVE",
            })
            .exec();
            assert.ok(result, Definer.general_err2);

            return result;

        } catch (err){
          throw err;  
        }
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