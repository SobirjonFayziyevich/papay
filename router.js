const express = require("express");
const router = express.Router(); //expressni ichidan routerni olib chiqayopmiz.

// router orqali turli xil routerlarni shaklllantiramiz.
router.get("/", function(req, res) { // localhost3000 (/) ga kirib kegan requistga javob beramiz.
    res.send("home sahifadasiz");

});

router.get("/menu", (req, res) => {
    res.send("Menu sahifadasiz");
});

router.get("/community", (req, res) => {
    res.send("Jamiyat sahifadasiz");
});

//bu faylni expoert qilamiz boshqa faylga.
module.exports = router;
