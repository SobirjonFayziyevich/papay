// classlar orqali boglanayopti
const BoArticleModel = require("../schema/bo_article.model");       // Schema modelni chaqirib olamiz.
const Definer = require("../lib/mistake");
const assert = require("assert");
const bcrypt = require("bcrypt");
const { shapeIntoMongooseObjectId, board_id_enum_list } = require("../lib/config");



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
         throw new Error(Definer.auth_err1);  
       }
    } 

    async getMemberArticlesData(member, mb_id, inquery) { //faqat save maqsadda ishlatiladi bu mathodimiz.
        try{
            const auth_mb_id = shapeIntoMongooseObjectId(member?._id); //auth mb_id hosil qilib shaping qilayopman
            mb_id = shapeIntoMongooseObjectId(mb_id);
            const page = inquery['page'] ? inquery['page'] * 1 : 1; // pageni inqueryni ichiga yuborayopman.
            const limit = inquery['limit'] ? inquery['limit'] * 1 : 5; 

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


        async getArticlesData(member, inquery) {
            try{
             const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
             let matches = inquery.bo_id === 'all' ?  // matches objectini hosil qilib oldim va inqueryni ichidagi bo_idni qiymatini (all)ga teng bulsa,
             { bo_id: {$in: board_id_enum_list}, art_status: 'active'} //bo_id  arraydagi qiymatdan birini olsin, va art_tatus active qiymatni retrive qilib bersin.
             : {bo_id: inquery.bo_id, art_status: 'active'}; // agar allga teng bulmagan vaqti, bo_idimiz inqueryni bo_idsiga teng bulsin, va ikkila holatda ham art_status active bulsin.
             inquery.limit *= 1; // inqueryni ichidagi limitni songa yalantirib oldim
             inquery.page *= 1; //pageni ham songa aylantirib olamiz.
             
             const sort = inquery.order //agarda order objectimiz bulmasa,
             ? {[`${inquery.order}`] : -1}
              : { createdAt:  -1 }; // sort objectimiz  vaqt buyicha sorting qiladi.

              const result = await this.boArticleModel.aggregate([
                  { $match: matches},
                  { $sort: sort},
                  { $skip: (inquery.page - 1)*inquery.limit },
                  { $limit: inquery.limit }, //bitta pageda nechta article mavjud bulishi kerak. 
                  {
                    $lookup: {
                        from: 'members', //memberdan izlayopman.
                        localField: 'mb_id',
                        foreignField: '_id',  //membersCollection ichidan qaysi datasitega tenglashtirmoqchisiz,(albatta bu mb_id;)
                        as: 'member_data',  //qaysi nom bn hosil qilib olmoqchisiz. 
                    },
                },
                  { $unwind: '$member_data'},  //object buladigan arraydagi objectini olib tugridan tugri member_data qiymatiga ichiga quyib ber degan mantiqni hosil qildim ,
      
                  // TODO: check auth member liked the chosen target.
                  
              ])
              .exec();


              assert.ok(result,Definer.article_err3);

              return result;
            } catch(err) {
              throw err;  
            }
        }
     } 
 
   


module.exports = Community;