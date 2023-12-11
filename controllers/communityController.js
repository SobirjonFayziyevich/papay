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
        
        const community = new Community(); // Community Service Model community objectini hosil qilib oldim.
        const result = await community.createArticleData(req.member, req.body); //req.member login bulgan userning kredinshili.
        assert.ok(result, Definer.general_err1);

        res.json({ state: "success", data: result });  // json bn orqaga qaytarish un state-success, datasi-image_url bulsin.

     } catch(err) {
        console.log(`ERROR, cont/createArticle, ${err.message}`);
        res.json({ state: "fail", message: err.message });
     }
};

communityController.getMemberArticles = async (req, res) => {
    try {
        console.log("GET cont/getMemberArticles");  //faqatgina Login bulgan usergina post bula oladi.
        // birinchi navbatda boshqa memberning atriclelarini retrive qiladigan mantiq yozsak.boshqa memberning mb_idsini query orqali yuborsak.
      const community = new Community(); //community Service modeldan community objectini hosil qilib oldim.

      const mb_id = req.query.mb_id !== 'none' ? req.query.mb_id : req.member?._id;
      assert.ok(mb_id, Definer.article_err1);   
      //agar queryni ichidagi member_id  none teng bulmasa,req.query.mb_idni olayopman,
      //agar nonega teng bulsa, authenticat bulgam mb_idsini olayopman.

      const result = await community.getMemberArticlesData(
          req.member, // 1chi kim bu narsani req qilayopti.
          mb_id,       // kimga tegishli bulgan malumotni retrive qilayopman.
          req.query,   //paginationga bog'liq bulgan malumotlarni retriv qilayopti, harbitta pageda nechta limit bulishi kerak.degan manoda.
          ); 

    
          res.json({ state: "success", data: result });  // json bn orqaga qaytarish 

    } catch(err) {
        console.log(`ERROR, cont/getMemberArticles, ${err.message}`);
        res.json({ state: "fail", message: err.message });
    }
};

communityController.getArticles = async (req, res) => {
    try{
     console.log("GET: cont/getArticles");
    //  console.log("query:::", req.query);
     const community = new Community();
     const result = await community.getArticlesData(req.member, req.query);


     res.json({ state: "success", data: result });

    } catch(err) {
      console.log(`ERROR, cont/getArticles, ${err.message}`);
      res.json({ state: "fail", message: err.message });
   }
};