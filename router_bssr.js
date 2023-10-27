


const express = require("express");
const router_bssr = express.Router();         // expressni ichidan routerni olib chiqayopmiz.
const restaurantController = require("./controllers/restaurantController");   // membercontrollerni chaqirib olayopmiz.
const productController = require("./controllers/productController");
const {uploadProductImage} = require("./utils/upload-multer");


/***************************************************
 *           BSSR  EJS (zamonaviy usul)            *
 ****************************************************/
// memberga dahldor routerlar
router_bssr.get("/",restaurantController.home); // main qismi uchun.

router_bssr
    .get("/sign-up", restaurantController.getSignupMyRestaurant)      // membercontrollerni ichidagi signupga borayopti.
    .post("/sign-up", restaurantController.signupProcess);


router_bssr
    .get("/login", restaurantController.getLoginMyRestaurant)     // membercontrollerni ichidagi loginga borayopti.
    .post("/login", restaurantController.loginProcess);

router_bssr.get("/logout",restaurantController.logoutProcess);             // membercontrollerni ichidagi logoutga borayopti.
router_bssr.get("/check-me",restaurantController.checkSession);    // sessionni tekshirish

router_bssr.get("/products/menu", restaurantController.getMyRestaurantProducts);

router_bssr.post("/products/create",
    restaurantController.validateAuthRestaurant,     //mahsulotni hosil qilih.
    uploadProductImage.array("product_images", 5), productController.addNewProduct);

router_bssr.post("/products/edit/:id",
    restaurantController.validateAuthRestaurant,
    productController.updateChosenProduct);


//bu faylni expoert qilamiz boshqa faylga.
module.exports = router_bssr;
