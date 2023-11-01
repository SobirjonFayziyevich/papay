// expressni ichidan routerni olib chiqayopmiz.
// membercontrollerni chaqirib olayopmiz.
const express=require("express"), router_bssr=express.Router();
const  restaurantController=require("./controllers/restaurantController");
const  productController=require("./controllers/productController");
const uploader_product = require("./utils/upload-multer")("products");
const uploader_members = require("./utils/upload-multer")("members");


/***************************************************
 *           BSSR  EJS (zamonaviy usul)            *
 ****************************************************/
// memberga dahldor routerlar
router_bssr.get("/",restaurantController.home); // main qismi uchun.

router_bssr
    .get("/sign-up", restaurantController.getSignupMyRestaurant)      // membercontrollerni ichidagi signupga borayopti.
    .post("/sign-up",
        uploader_members.single("restaurant_img"),
        restaurantController.signupProcess);


router_bssr
    .get("/login", restaurantController.getLoginMyRestaurant)     // membercontrollerni ichidagi loginga borayopti.
    .post("/login", restaurantController.loginProcess);

router_bssr.get("/logout",restaurantController.logoutProcess);             // membercontrollerni ichidagi logoutga borayopti.
router_bssr.get("/check-me",restaurantController.checkSession);    // sessionni tekshirish

router_bssr.get("/products/menu", restaurantController.getMyRestaurantProducts);

router_bssr.post("/products/create",
    restaurantController.validateAuthRestaurant,     //mahsulotni hosil qilih.
    uploader_product.array("product_images", 5),
    productController.addNewProduct);

router_bssr.post("/products/edit/:id",
    restaurantController.validateAuthRestaurant,
    productController.updateChosenProduct);


//bu faylni expoert qilamiz boshqa faylga.
module.exports = router_bssr;
