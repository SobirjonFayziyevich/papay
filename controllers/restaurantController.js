/* object yasalib uni modulening ichidagi exportga tenglashtirilyabdi
 object da methodlari orqali chaqirilyabdi
 controllerlar object orqali quriladi, model class lar orqali quramiz
 */
const Member=require("../models/Member");
const Product=require("../models/Product");  // Product mantiqini yozib oldik.
const Definer=require("../lib/mistake");
const assert=require("assert");
const Restaurant = require("../models/Restaurant");


let restaurantController=module.exports;

restaurantController.home=(req, res) => {
    try {
        console.log("GET: cont/home");
        res.render('home-page');  // home-page.ejs fileimizga malumotni yuborayopti.
    } catch (err) {
        console.log(`ERROR: cont/home, ${err.message}`);  //error bulsa qaytar degan qism.
        res.json({state: "fail", message: err.message});
    }
};

restaurantController.getMyRestaurantProducts=async (req, res) => {
    try {
        console.log("GET: cont/getMyRestaurantProducts");
        const product=new Product();       // Product serves modelclassidan => product OBJECTINI hosil qilayopmiz
        const data=await product.getAllProductsDataResto(res.locals.member);

        //product object ichidan productlarni listini olib beradi
        //kim req qilayotganini biz ( restaurantController.validateAuthRestaurant) manashu yul bn chaqirayotgan edik shuni urniga,
        // app.jsda (res.locals.member) qayerga borishini yuklagandik,va biz(res locals member)ni ichidan datalarni olayopmiz.

        res.render("restaurant-menu", {restaurant_data: data});    //restaurant-menu.ejsga restarantga tegishli bulgan productlar ruyxati yuborayopmiz.
    } catch (err) {
        console.log(`ERROR: cont/getMyRestaurantProducts, ${err.message}`);
        res.redirect("/resto");
        // res.json({state: "fail", message: err.message});
    }
};


restaurantController.getSignupMyRestaurant=async (req, res) => {
    try {
        console.log("GET: cont/getSignupMyRestaurant");
        res.render("signup");     //  page berilmoqda qayerga  yubishini kursatmoqda
    } catch (err) {
        console.log(`ERROR: cont/getSignupMyRestaurant, ${err.message}`);
        res.json({state: "fail", message: err.message});
    }
};

restaurantController.signupProcess=async (req, res) => {
    try {
        console.log("POST: cont/signupProcess");
        assert(req.file, Definer.general_err3);

        // console.log("body:", req.body);
        // console.log("file:", req.file);
        // assert(req.file, Definer.general_err3);
        // res.send("success");

        let new_member=req.body;
        new_member.mb_type="RESTAURANT";      // ADMINKA un kerak malumot.
        new_member.mb_image=req.file.path;    //yuklangan image ni  kiritayopmiz.

        const member=new Member();   //ichida request body yuborilyabdi.//
        const result=await member.signupData(new_member);
        assert(result, Definer.general_err1);

        req.session.member=result;
        res.redirect("/resto/products/menu");
    } catch (err) {
        console.log(`ERROR, cont/signupProcess, ${err.message}`);
        res.json({state: "fail", message: err.message});
    }
};

restaurantController.getLoginMyRestaurant=async (req, res) => {
    try {
        console.log("GET: cont/getLoginMyRestaurant");
        res.render("login-page");
    } catch (err) {
        console.log(`ERROR, cont/getLoginMyRestaurant, ${err.message}`);
        res.json({state: "fail", message: err.message});
    }
};

restaurantController.loginProcess=async (req, res) => {
    try {
        console.log("POST: cont/loginProcess");
        const data=req.body,
            member=new Member(),    //ichida request body yuborilyabdi
            result=await member.loginData(data);

        req.session.member=result;
        req.session.save(function () {            //login bolgandan ken qaysi page ga borishi mumkinligini korsatyabmiz
            result.mb_type === "ADMIN"                  //sababi bizng user ADMIN emas, restaurant.
                ? res.redirect("/resto/all-restaurant")      //ADMIN USER lar login bulganda ishlatamiz.
                : res.redirect("/resto/products/menu");
        });
    } catch (err) {
        res.json({state: "fail", message: err.message});
        console.log(`ERROR, cont/loginProcess, ${err.message}`);
    }
};


restaurantController.logout=(req, res) => {
    try {
        console.log("GET cont/logout");
        req.session.destroy(function () {    //req ichidagi sessionni destroy qilsin
            res.redirect("/resto");                // redirect yunaltirayopti restoga
        });
    } catch (err) {
        console.log(`ERROR,cont/logout, ${err.message}`);
        res.json({state: "fail", message: err.message});
    }
    // res.send("logout page")
};

restaurantController.validateAuthRestaurant=(req, res, next) => {
    if (req.session?.member?.mb_type === "RESTAURANT") {
        req.member=req.session.member;
        next();
    } else
        res.json({
            state: "fail",
            message: "only authenticated members with restaurant type"
        })
};


restaurantController.checkSession=(req, res) => {
    if (req.session?.member) {
        res.json({state: 'succeed', data: req.session.member});
    } else {
        res.json({state: "fail", message: "You aren't authenticated"});
    }
};

restaurantController.validateAdmin = (req, res, next) => {
    if (req.session?.member?.mb_type === "ADMIN") {
        req.member = req.session.member;   // sessionni ichidagi member datesini requestni.member elementiga yuklab bersin.
        next();                             //ADMIN user bulsa keyingi qatorga utkazsin.
    } else {
        const html =
            `<script>         //html shaklida javob berayopmiz.
              alert('Admin page: Permission denied!');
              window.location.replace('/resto'); //locationni uzgartirsin va homepagega yuborsin
              </script>`;
        res.end(html);
    }

};

restaurantController.getAllRestaurants = async (req, res ) => {
    try {
        console.log("GET cont/getAllRestaurants");
        // res.render("all-restaurants");
        // getAllRestaurants methodi un bir methodni hosil qilib olsak.
        // restaurant objecti va  new Restaurant service module yordamida qurib olamiz.
        const restaurant= new Restaurant(),
            restaurants_data = await restaurant.getAllRestaurantsData(); // butun resta larni getAllRestaurantData methodi orqali chaqirib olamiz.
        console.log("restaurants_data:",restaurants_data);

        res.render("all-restaurants", { restaurants_data: restaurants_data });  // qabul qilnayotgan datalarni restaurantData nomi bn yuboramiz.

    } catch(err) {
        console.log(`ERROR,cont/getAllRestaurants, ${err.message}`);
        res.json({state: "fail", message: err.message});
    }
}

