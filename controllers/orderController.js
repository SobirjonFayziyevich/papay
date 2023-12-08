// turli xil metodlarni yuklashimiz mumkin
const Order = require("../models/Order");
const jwt = require('jsonwebtoken');
const assert = require("assert");
const Definer = require("../lib/mistake");


// memberController object methodlari orqali boglanayopti
let orderController = module.exports;
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

