// turli xil metodlarni yuklashimiz mumkin
const Order = require("../models/Order");
const jwt = require('jsonwebtoken');



// memberController object methodlari orqali boglanayopti
let orderController = module.exports;
const assert = require("assert");
const Definer = require("../lib/mistake");
// createOrderdan faqatgina authenticatet bulganlar foydalana olishi kerak.


orderController.createOrder = async (req, res) => {
    try {    // satandartlarni qurish:
        console.log("POST: cont/createOrder");    //routerdan kirib kelgan req turi.
        assert.ok(req.member, Definer.auth_err5);  //kelayotgan requestimizni member objecti login user bulgan bulsa, keyingi bosqichga utkazamiz,
        // login bulmagan user bulsa, auth err bersin.
        
        // console.log(req.body);
        
        const order = new Order(); // Order Service model
         const result = await order.createOrderData(req.member, req.body);

        res.json({state: 'success', data: result }); //standartdagi javob muaffaqiyatli bulsa
    } catch (err) {
        console.log(`ERROR, cont/createOrder, ${err.message}`);
        res.json({state: 'fail', message: err.message}); // json format orqali, createOrder requestiga login bulmagan user bulsa ham,
        //json formatda kostimayzed qilgan errorni qabul qilib oladi.
    }
};

orderController.getMyOrders = async (req, res) => {
    try {
        console.log("GET: cont/getMyOrders"); //getMyOrdersni faqatgina Authenticated bulgan userlargina ishlata olishi mumkin.
        assert.ok(req.member, Definer.auth_err5); 

        const order = new Order();  //order objectini yasab oldim
        const result = await order.getMyOrdersData(req.member, req.query); // order objectimda getMyOrders mathodini hosil qildim.
                                     //req.query orqali menga qanday malumotlar kerakligini yuborayopman
        res.json({state: 'success', data: result }); //standartdagi javob muaffaqiyatli bulsa
    } catch (err) {
        console.log(`ERROR, cont/getMyOrders, ${err.message}`);
        res.json({state: 'fail', message: err.message}); // json format orqali, createOrder requestiga login bulmagan user bulsa ham,
        //json formatda kostimayzed qilgan errorni qabul qilib oladi.
    }
}

