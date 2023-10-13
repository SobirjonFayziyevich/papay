const express = require("express");
const router = express.Router(); // expressni ichidan routerni olib chiqayopmiz.
const memberController = require("./controllers/memberController"); // membercontrollerni chaqirib olayopmiz.

// // router orqali turli xil routerlarni shaklllantiramiz.
// router.get("/", function(req, res) { // localhost3000 (/) ga kirib kegan requistga javob beramiz.
//     res.send("home sahifadasiz");
// });

// memberga dahldor routerlar
router.get("/", memberController.home); // membercontrollerni ichidagi homega borayopti.
router.post("/signup", memberController.signup); // membercontrollerni ichidagi signupga borayopti.
router.post("/login", memberController.login); // membercontrollerni ichidagi loginga borayopti.
router.get("/logout", memberController.logout); // membercontrollerni ichidagi logoutga borayopti.


// boshqa routerlar
router.get("/menu", (req, res) => {
    res.send("Menu sahifadasiz");
});

router.get("/community", (req, res) => {
    res.send("Jamiyat sahifadasiz");
});

//bu faylni expoert qilamiz boshqa faylga.
module.exports = router;
