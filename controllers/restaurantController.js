/* object yasalib uni modulening ichidagi exportga tenglashtirilyabdi
 object da methodlari orqali chaqirilyabdi
 controllerlar object orqali quriladi, model class lar orqali quramiz
 */
const Member = require("../models/Member");
const Product = require("../models/Product");  // Product mantiqini yozib oldik.

let restaurantController = module.exports;

restaurantController.home = (req,res) => {
    try {
        console.log("GET: cont/home");
        res.render('home-page');  // home-page.ejs fileimizga malumotni yuborayopti.
    } catch(err) {
        console.log(`ERROR: cont/home, ${err.message}`);  //error bulsa qaytar degan qism.
        res.json({state: "fail", message: err.message});
    }
};

restaurantController.getMyRestaurantProducts = async (req, res) => {
    try {
        console.log("GET: cont/getMyRestaurantProducts");
        // TODO get my restaurant products

        const product = new Product();               // Product classidan => product OBJECTINI hosil qilayopmiz
        const data = await product.getAllProductsDataResto(res.locals.member);
        //product object ichidan productlarni listini olib beradi
        //kim req qilayotganini biz ( restaurantController.validateAuthRestaurant) manashu yul bn chaqirayotgan edik shuni urniga,
        // app.jsda (res.locals.member) qayerga borishini yuklagandik,va biz(res locals member)ni ichidan datalarni olayopmiz.

        res.render("restaurant-menu", { restaurant_data: data }); //restaurant-menu pagega restarantga tegishli bulgan productlar ruyxati yuborayopmiz.
    } catch(err) {
        console.log(`ERROR: cont/getMyRestaurantProducts, ${err.message}`);
        res.json({state: "fail", message: err.message});
    }
};


restaurantController.getSignupMyRestaurant = async (req, res) => {
    try {
        console.log("GET: cont/getSignupMyRestaurant");
        res.render("signup");     //  page berilmoqda qayerga  yubishini kursatmoqda
    } catch(err) {
        console.log(`ERROR: cont/getSignupMyRestaurant, ${err.message}`);
        res.json({state: "fail", message: err.message});
    }
};

restaurantController.signupProcess = async (req, res ) => {
    try {
        console.log("POST: cont/signup");
        const data = req.body,
              member= new Member(),   //ichida request body yuborilyabdi.//
              new_member = await member.signupData(data);

        res.session.member = new_member;
        res.redirect("/resto/products/menu");
    } catch(err){
        console.log(`ERROR, cont/signup, ${err.message}`);
        res.json({ state: "fail", message: err.message});
    }
};

restaurantController.getLoginMyRestaurant = async (req, res ) => {
    try {
        console.log("GET: cont/getLoginMyRestaurant");
        res.render("login-page");
    } catch(err){
        console.log(`ERROR, cont/getLoginMyRestaurant, ${err.message}`);
        res.json({state: "fail", message: err.message});
    }
};

restaurantController.loginProcess = async (req, res ) => {
    try {
        console.log("POST: cont/login");
        const data = req.body;
        member = new Member(),    //ichida request body yuborilyabdi
            result = await member.loginData(data);

        req.session.member = result;
        req.session.save(function () {     //login bolgandan ken qaysi page ga borishi mumkinligini korsatyabmiz
            res.redirect("/resto/products/menu");
        });
    } catch(err){
        console.log(`ERROR, cont/login, ${err.message}`);
        res.json({state: "fail", message: err.message});
    }
};


restaurantController.logoutProcess = (req, res ) => {
    console.log("GET cont/logout");
    res.send("logout page");
};

restaurantController.validateAuthRestaurant = (req, res, next) => {
    if(req.session?.member?.mb_type === "RESTAURANT") {
        req.member = req.session.member;
        next();
    } else
        res.json({
            state: "fail",
            message: "only authenticated members with restaurant type" })
};


restaurantController.checkSession = (req, res ) => {
    if(req.session?.member) {
        res.json({state: 'succeed', data: req.session.member });
    } else {
        res.json ({state: "fail", message: "You aren't authenticated"});
    }
};

