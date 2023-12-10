


// classlar orqali boglanayopti
const BoArticleModel = require("../schema/bo_article.model");       // Schema modelni chaqirib olamiz.
const Definer = require("../lib/mistake");
const assert = require("assert");
const bcrypt = require("bcrypt");
const { shapeIntoMongooseObjectId } = require("../lib/config");



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
}

module.exports = Community;