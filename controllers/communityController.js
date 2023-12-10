let communityController = module.exports; // comCont export qilib oldim
const assert = require("assert");
const Definer = require("../lib/mistake");
const Community = require("../models/Community");

communityController.imageInsertion = async (req, res) => {   //comContga imageInsertion mathodini hosil qilib oldim.
    try {
        console.log("POST cont/imageInsertion");
        assert.ok(req.file, Definer.general_err3);  //requestni ichida fayl bormi yuqmi? 
        const image_url = req.file.path;            //image URLni req file ichidagi (path)degan element orqali olib,

        res.json({ state: "success", data: image_url });  // json bn orqaga qaytarish un state-success, datasi-image_url bulsin.


    } catch(err) {
      console.log(`ERROR, cont/imageInsertion, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }

};

communityController.createArticle = async (req, res) => {
     try {
        console.log("POST cont/createArticle");  //faqatgina Login bulgan usergina post bula oladi.
        
        const community = new Community(); // Community Service Model hosil qildim
        const result = await community.createArticleData(req.member, req.body); //req.member login bulgan userning kredinshili.
        assert.ok(result, Definer.general_err1);

        res.json({ state: "success", data: result });  // json bn orqaga qaytarish un state-success, datasi-image_url bulsin.

     } catch(err) {
        console.log(`ERROR, cont/createArticle, ${err.message}`);
        res.json({ state: "fail", message: err.message });
     }
};