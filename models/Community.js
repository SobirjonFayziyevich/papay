// classlar orqali boglanayopti
const BoArticleModel = require("../schema/bo_article.model");       // Schema modelni chaqirib olamiz.
const Definer = require("../lib/mistake");
const assert = require("assert");
const bcrypt = require("bcrypt");
const { shapeIntoMongooseObjectId, board_id_enum_list,lookup_auth_member_liked } = require("../lib/config");
const Member = require("./Member");
const { auth_err5 } = require("../lib/mistake");



class Community {
    constructor() {
        this.boArticleModel = BoArticleModel;   // BoArticle Service Modelimiz;
    }
    async createArticleData(member, data) {
              // biz article hosil qilayotgan paytimiz qaysi datalarni yuborishimiz kerak? 
              //(art_subject,art_content, bo_id, mb_id bulishi shart).
         try { 
           data.mb_id = shapeIntoMongooseObjectId(member._id); //req.body-bu data va uni ichidan mb_id olayopman va uni shaping qilgan holatda login bulgan userning kredenshilidan idni olib insert qildim.
           const new_article = await this.saveArticleData(data); // Schema modelini ichiga datani pass qilib new_article mathodiga tenglashtirib oldim.
        // console.log("new_article:::", new_article );
           return new_article;
        } catch(err) {
           throw err; 
        }
    } 

    async saveArticleData(data) { //faqat save maqsadda ishlatiladi bu mathodimiz.
       try{
         const article = new this.boArticleModel(data); //Schema modelga datani pass qilib article mathodiga tenglashtirib olayopmiz.
         return await article.save();  //article mathodimni qiymatini save qilib qaytarsin, 
       } catch(mongo_err) {
           console.log(mongo_err); //agar xatolik bulsa, kursatsin.
         throw new Error(Definer.mongo_validation_err1);  
       }
    } 

    async getMemberArticlesData(member, mb_id, inquiry) { //faqat save maqsadda ishlatiladi bu mathodimiz.
        try{
            const auth_mb_id = shapeIntoMongooseObjectId(member?._id); //auth mb_id hosil qilib shaping qilayopman
            mb_id = shapeIntoMongooseObjectId(mb_id);
            const page = inquiry['page'] ? inquiry['page'] * 1 : 1; // pageni inquiry ichiga yuborayopman.
            const limit = inquiry['limit'] ? inquiry['limit'] * 1 : 5; 

            const result = await this.boArticleModel
            .aggregate([ // aggregateni ichiga arrayni provite qildim.
                { $match: { mb_id: mb_id, art_status: 'active' } }, //matchingni objecti mb_id teng bulayopti mb-idga,
                { $sort: { createdAt: -1 } },  //hosil bulish vaqtiga qarab, yuqoridan pastga, eng oxirgisini birinchi kursat.
                { $skip: ( page - 1 ) * limit }, // 1chi pagedagi limitlar soni.
                { $limit: limit}, //qayergacha degan mantiq.
                {
                    $lookup: {
                        from: 'members', //memberdan izlayopman.
                        localField: 'mb_id',
                        foreignField: '_id',  //membersCollection ichidan qaysi datasitega tenglashtirmoqchisiz,(albatta bu mb_id;)
                        as: 'member_data',  //qaysi nom bn hosil qilib olmoqchisiz. 
                    },
                },

                //mb_datani ichida array bulishi shart emas shunday holatda nima qilishim kerak:
                { $unwind: '$member_data'}, //object buladigan arraydagi objectini olib tugridan tugri member_data qiymatiga ichiga quyib ber degan mantiqni hosil qildim ,
                lookup_auth_member_liked(auth_mb_id),
 
                // TODO: check auth member liked the chosen target.
            ])
            .exec();
            assert.ok(result, Definer.article_err2);

            //mb_idga tegishli malumotlar mb_data bn qaytarib berilsin unda nima qilamiz.

            return result;
        } catch(err) {
           throw err; 
           
        }
    }   
    
    async getArticlesData(member, inquiry) {
            try{
             const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
             let matches = inquiry.bo_id === 'all' ?  // matches objectini hosil qilib oldim va inquiry ichidagi bo_idni qiymatini (all)ga teng bulsa,
             { bo_id: {$in: board_id_enum_list}, art_status: 'active'} //bo_id  arraydagi qiymatdan birini olsin, va art_tatus active qiymatni retrive qilib bersin.
             : {bo_id: inquiry.bo_id, art_status: 'active'}; // agar allga teng bulmagan vaqti, bo_idimiz inquiry bo_idsiga teng bulsin, va ikkila holatda ham art_status active bulsin.
             inquiry.limit *= 1; // inquiry ichidagi limitni songa yalantirib oldim
             inquiry.page *= 1; //pageni ham songa aylantirib olamiz.
             
             const sort = inquiry.order //agarda order objectimiz bulmasa,
             ? {[`${inquiry.order}`] : -1}
              : { createdAt:  -1 }; // sort objectimiz  vaqt buyicha sorting qiladi.

              const result = await this.boArticleModel.aggregate([
                  { $match: matches},
                  { $sort: sort},
                  { $skip: (inquiry.page - 1)*inquiry.limit },
                  { $limit: inquiry.limit }, //bitta pageda nechta article mavjud bulishi kerak. 
                  {
                    $lookup: {
                        from: 'members', //atabasedagi members collectiondan izlayopman.
                        localField: 'mb_id', // yuqoridagi tenglashtirb olgan mb_id izlayopmiz
                        foreignField: '_id',  //membersCollection ichidan qaysi datasitega tenglashtirmoqchisiz,(albatta bu mb_id;)
                        as: 'member_data',  //qaysi nom bn hosil qilib olmoqchisiz. 
                    },
                },  //olgingan array natijani, object kurinishiga uzgartirish.
                  { $unwind: '$member_data'},  //object buladigan arraydagi objectini olib tugridan tugri member_data qiymatiga ichiga quyib ber degan mantiqni hosil qildim ,
                  
                   // TODO: check auth member liked the chosen target.
                  lookup_auth_member_liked(auth_mb_id),

                  ])
              .exec();
              assert.ok(result,Definer.article_err3);
              return result;
            } catch(err) {
              throw err;  
            }
        }

        async getChosenArticleData(member, art_id) {
            try {
              art_id = shapeIntoMongooseObjectId(art_id);
              if(member) { // agar men login bulmaga user bulsam, buyerga malumot kelmaydi.
                const member_obj = new Member();
                await member_obj.viewChosenItemByMember(member, art_id, "community");
            }
            const result = await this.boArticleModel.findById({ _id: art_id }).exec();
              // Schema modelimizni findByid qilib art_id ni past qilayopmiz.

             assert.ok(result, Definer.article_err3); 
             return result;
           } catch(err) {
             throw err;  
            }
        }
    } 
 
   


module.exports = Community;