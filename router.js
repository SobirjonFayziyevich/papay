const express=require("express");
const router=express.Router(); // expressni ichidan routerni olib chiqayopmiz.
const memberController=require("./controllers/memberController"); // membercontrollerni chaqirib olayopmiz.
const productController=require("./controllers/productController");
const {getChosenMember} = require("./controllers/memberController");
const {getAllProducts} = require("./controllers/productController");
const restaurantController=require("./controllers/restaurantController");


/*******************************************
 *           RECT  API (REACT UN)           *
 *********************************************/


// Member related routers
router.post("/signup", memberController.signup); // membercontrollerni ichidagi signupga borayopti.
router.post("/login", memberController.login); // membercontrollerni ichidagi loginga borayopti.
router.get("/logout", memberController.logout); // membercontrollerni ichidagi logoutga borayopti.
router.get ("/check-me", memberController.checkMyAuthentication);
router.get ("/member/:id", memberController.retrieveAuthMember,
 memberController.getChosenMember);


// // Product related roters
 router.post("/products", memberController.retrieveAuthMember, // bizni kimligimizni aniqlaydi. va likelarni kim bosganini ham bildiradi.
 productController.getAllProducts ); //barcha restar mahsulotlarini bitta qilib qyozish.

 router.post(
    "/products",
    memberController.retrieveAuthMember,  //
    productController.getAllProducts);

router.get("/products/:id", memberController.retrieveAuthMember, //auth user chosen productga like bosganmi yuqmi. 
                                                                 // agar bosilgan bulsa kirgan paytimiz qizil rangda like bulishi lozim.
productController.getChosenProduct);

router.get("/restaurants", memberController.retrieveAuthMember,
restaurantController.getRestaurants);


router.get("/restaurants/:id", memberController.retrieveAuthMember,
restaurantController.getChosenRestaurant);


//bu faylni expoert qilamiz boshqa faylga.
module.exports = router;
