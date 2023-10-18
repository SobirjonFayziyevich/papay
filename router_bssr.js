


const express = require("express");
const router_bssr = express.Router(); // expressni ichidan routerni olib chiqayopmiz.
const restaurantController = require("./controllers/restaurantController"); // membercontrollerni chaqirib olayopmiz.

/***************************************************
 *           BSSR  EJS (zamonaviy usul)            *
 ****************************************************/


// memberga dahldor routerlar
router_bssr.get("/signup", restaurantController.getSignupMyRestaurant); // membercontrollerni ichidagi signupga borayopti.
router_bssr.post("/signup", restaurantController.signupProcess);

router_bssr.get("/login", restaurantController.getLoginMyRestaurant);// membercontrollerni ichidagi loginga borayopti.
router_bssr.post("/login", restaurantController.loginProcess);

router_bssr.get("/logout",restaurantController.logout); // membercontrollerni ichidagi logoutga borayopti.


//bu faylni expoert qilamiz boshqa faylga.
module.exports = router_bssr;
