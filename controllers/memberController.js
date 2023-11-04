// turli xil metodlarni yuklashimiz mumkin
const Member=require("../models/Member");
// memberController object methodlari orqali boglanayopti
let memberController=module.exports;

memberController.signup=async (req, res) => {
    try {    // satandartlarni qurish:
        console.log("POST: cont/signup");    //routerdan kirib kelgan req turi.
        const data=req.body,               //req body qismidan malumot olamiz.
            member=new Member(),
            new_member=await member.signupData(data);   //ichida request body yuborilyabdi
        // TODO: AUTHENTICATE BASED ON JWT

        res.json({state: 'succeed', data: new_member}); //standartdagi javob muaffaqiyatli bulsa
    } catch (err) {
        console.log(`ERROR, cont/signup, ${err.message}`);
        res.json({state: 'fail', message: err.message}); // standartdagi javob xato bulsa
    }
};

memberController.login=async (req, res) => {
    try {                                        // satandartlarni qurish:
        console.log("POST: cont/login");        //routerdan kirib kelgan req turi.
        const data=req.body,                  //req body qismidan malumot olamiz.
            member=new Member(),
            result=await member.loginData(data);   //ichida request body yuborilyabdi

        res.json({state: "succeed", data: result}); //standartdagi javob muaffaqiyatli bulsa
    } catch (err) {
        console.log(`ERROR, cont/login, ${err.message}`);
        res.json({state: 'fail', message: err.message}); // standartdagi javob xato bulsa
    }
};

memberController.logout=(req, res) => {
    console.log("GET cont/logout");
    res.send("logout page");
};