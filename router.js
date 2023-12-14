const express=require("express");
const router=express.Router(); // expressni ichidan routerni olib chiqayopmiz.
const memberController=require("./controllers/memberController"); // membercontrollerni chaqirib olayopmiz.
const productController=require("./controllers/productController");
const {getChosenMember} = require("./controllers/memberController");
const {getAllProducts} = require("./controllers/productController");
const orderController = require("./controllers/orderController");
const communityController = require("./controllers/communityController");
const followController = require("./controllers/followController");
const restaurantController = require("./controllers/restaurantController");
const uploader_community = require('./utils/upload-multer')("community"); //community adressi.
// community argumenti asosida uploader objectini yasab beradi,
const uploader_member = require('./utils/upload-multer')("members"); //members adressi.
// member argumenti asosida uploader objectini yasab beradi,

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


 // post va get mathod, product,restaurants bular URL hisoblanadi, 
 // PRODUCT RELATED ROUTERS
router.post("/products", memberController.retrieveAuthMember, // bizni kimligimizni aniqlaydi. va likelarni kim bosganini ham bildiradi.
 productController.getAllProducts ); //barcha restar mahsulotlarini bitta qilib qyozish.
router.post(
    "/products",
    memberController.retrieveAuthMember,  //
    productController.getAllProducts);
router.get("/products/:id", memberController.retrieveAuthMember, //auth user chosen productga like bosganmi yuqmi.
productController.getChosenProduct);

// RESTAURANT RELATED ROUTERS
router.get("/restaurants", memberController.retrieveAuthMember,
restaurantController.getRestaurants);


router.get("/restaurants/:id", memberController.retrieveAuthMember,
restaurantController.getChosenRestaurant);


// ORDER RELATED ROUTERS: (faqat orderlarga dahldor);
router.post("/orders/create", 
memberController.retrieveAuthMember,
orderController.createOrder);

router.get("/orders",memberController.retrieveAuthMember,
orderController.getMyOrders);

router.post("/orders/edit",memberController.retrieveAuthMember, //memberControllerga authenticated bulgan userni chaqirib oldim.
orderController.editChosenOrder); //orderControllerimizdan editCosenOrder methodimizni chaqirib oldim.

// API URL => community/create, orders/edit, restaurant, products mamashu mathodlar API URl hisoblanadi.
// COMMUNITY RELATED ROUTERS START:
router.post("/community/image",uploader_community.single('community_image'), //single mathod orqali imageni community_image nomi bn backendga yubordim.
communityController.imageInsertion ); //keyingi mantiqim communityControllerni hosil qilib unga,maxsus imageInsertion degan mathodni yozib oldim.

router.post("/community/create", memberController.retrieveAuthMember,
communityController.createArticle); 

router.get("/community/articles", memberController.retrieveAuthMember,
communityController.getMemberArticles); 

router.get("/community/target", memberController.retrieveAuthMember, // buyerda harqanday atriclega like bosganmizmi, yuqmi shuni topish un uzimizni retrive qilishimz kerak.
communityController.getArticles);

router.get("/community/single-article/:art_id", memberController.retrieveAuthMember, // buyerda harqanday atriclega like bosganmizmi, yuqmi shuni topish un uzimizni retrive qilishimz kerak.
communityController.getChosenArticle); 

//  Following related router;
router.post("/follow/subscribe", memberController.retrieveAuthMember,
followController.subscribe);

router.post("/follow/unsubscribe", memberController.retrieveAuthMember,
followController.unsubscribe);


//bu faylni expoert qilamiz boshqa faylga.
module.exports = router;
