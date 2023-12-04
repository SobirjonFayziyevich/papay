const express=require("express");
const router=express.Router(); // expressni ichidan routerni olib chiqayopmiz.
const memberController=require("./controllers/memberController"); // membercontrollerni chaqirib olayopmiz.
const productController=require("./controllers/productController");
const {getChosenMember} = require("./controllers/memberController");
const {getAllProducts} = require("./controllers/productController");


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
    memberController.retrieveAuthMember,
    productController.getAllProducts);

router.get("/products/:id", memberController.retrieveAuthMember,
productController.getChosenProduct);

//bu faylni expoert qilamiz boshqa faylga.
module.exports = router;
