


const express = require("express");
const router = express.Router();
const router_bssr = express.Router(); // expressni ichidan routerni olib chiqayopmiz.
const restaurantController = require("./controllers/restaurantController"); // membercontrollerni chaqirib olayopmiz.
const productController = require("./controllers/productController");

/***************************************************
 *           BSSR  EJS (zamonaviy usul)            *
 ****************************************************/


// memberga dahldor routerlar
router_bssr
    .get("/signup", restaurantController.getSignupMyRestaurant) // membercontrollerni ichidagi signupga borayopti.
    .post("/signup", restaurantController.signupProcess);


router_bssr
    .get("/login", restaurantController.getLoginMyRestaurant) // membercontrollerni ichidagi loginga borayopti.
    .post("/login", restaurantController.loginProcess);

router_bssr.get("/logout",restaurantController.logout); // membercontrollerni ichidagi logoutga borayopti.
router_bssr.get("/check-me",restaurantController.checkSessions); // sessionni tekshirish

router_bssr.get("/products/menu",restaurantController.getMyRestaurantData);
router_bssr.post("/products/create", restaurantController.validateAuthRestaurant,productController.addNewProduct);    //mahsulotni hosil qilih.
router_bssr.post("products/edit/:id", productController.updateChosenProduct);    //mahsulot qushadigan.


//bu faylni expoert qilamiz boshqa faylga.
module.exports = router_bssr;

