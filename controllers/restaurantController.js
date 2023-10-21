
// turli xil metodlarni yuklashimiz mumkin.
const Member = require("../models/Member");
// memberController object methodlari orqali boglanayopti
let restaurantController = module.exports;

restaurantController.getMyRestaurantData = async (req, res) => {
    try {
        console.log("GET: cont/getMyRestaurantData");
     // TODO: Get my restaurant products  //product controllerlar ochsak malumotni yozamiz.

        res.render('restaurant-menu');
    } catch (err) {
        console.log(`ERROR, cont/getMyRestaurantData, ${err.message}`);
        res.json({state: 'fail', message: err.message});
    }
};

restaurantController.getSignupMyRestaurant = async (req, res) => {
    try {
        console.log("GET: cont/getSignupMyRestaurant");
        res.render('signup');
    } catch (err) {
        console.log(`ERROR, cont/getSignupMyRestaurant, ${err.message}`);
        res.json({state: 'fail', message: err.message});
    }
};

restaurantController.signupProcess = async (req, res ) => {
    try {
        console.log("POST: cont/signup");                                 //routerdan kirib kelgan req turi.
        const data = req.body,                                          //req body qismidan malumot olamiz.
        member = new Member(),
            new_member = await member.signupData(data);   //ichida request body yuborilyabdi

        req.session.member = new_member;                               //req ichiga sessionni hosil qilib uni ichiga memberni save qilayopmiz.
        res.redirect('/resto/products/menu');                          //products/menu rutrga malumotni yuborayopmz.


        // SESSION

        // res.json({state: 'succeed', data: new_member});                 //standartdagi javob muaffaqiyatli bulsa
    } catch(err)  {
        console.log(`ERROR, cont/signup, ${err.message}`);
        res.json({state: 'fail', message: err.message});                     // standartdagi javob xato bulsa
    }
};

restaurantController.getLoginMyRestaurant = async (req, res) => {
    try {
        console.log("GET: cont/getLoginMyRestaurant");
        res.render('login-page');
    } catch (err) {
        console.log(`ERROR, cont/getLoginMyRestaurant, ${err.message}`);
        res.json({state: 'fail', message: err.message});
    }
}

restaurantController.loginProcess = async (req, res ) => {
    try {
        console.log("POST: cont/login");                                             //routerdan kirib kelgan req turi.
        const data = req.body,                                                      //req body qismidan malumot olamiz.
              member = new Member(),
             result = await member.loginData(data);   //ichida request body yuborilyabdi
        req.session.member = result;
        req.session.save(function() {
           res.redirect('/resto/products/menu');
        })

        // res.json({ state: "succeed", data: result}); //standartdagi javob muaffaqiyatli bulsa
    } catch(err)  {
        console.log(`ERROR, cont/login, ${err.message}`);
        res.json({state: 'fail', message: err.message}); // standartdagi javob xato bulsa
    }
};

restaurantController.logout = (req, res ) => {
    console.log("GET cont.logout");
    res.send("logout page");
};

restaurantController.validateAuthRestaurant = (req, res,next) => {
    if (req.session?.member?.mb_type === "RESTAURANT") {  //kelayotgam req= ichidagi sessionda member valusi bulsa,va mb_type RESRAURANT bulsa.
        req.member = req.session.member;  // req member qismiga req.session.member tenglashtirib olamz.
        next();          //keyingisiga utishga ruxsat beramiz.
    } else               //aks holda
        res.json({      //res.json bn javob qaytarsak.
            state: "fail",
            message: "only authenticated members with restaurant type",
        });
};

restaurantController.checkSessions = (req, res ) => {
    if (req.session?.member) {
        res.json({ state: "succeed", data: req.session.member });
    } else {
        res.json({state: "fail", message: "You are not authenticated"});
    }
};