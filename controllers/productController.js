
let productController = module.exports;

productController.getAllProducts = async (req, res) => {       // hamma productlarni oladigam method.
    try {
        console.log("GET: cont/getAllProducts");
    } catch(err) {
        console.log(`ERROR, cont/getAllProducts, ${err.message}`);
        res.json({ state: "fail", message: err.message });
    }
};

productController.addNewProduct = async (req, res) => {       // hamma productlarni oladigam method.
    try {
        console.log("POST: cont/addNewProduct");
        console.log(req.member);
        //TODO: product creation develop

    } catch(err) {
        console.log(`ERROR, cont/addNewProduct, ${err.message}`);

    }
};

productController.updateChosenProduct = async (req, res) => {       // hamma productlarni oladigam method.
    try {
        console.log("POST: cont/updateChosenProduct");
    } catch(err) {
        console.log(`ERROR, cont/updateChosenProduct, ${err.message}`);

    }
};

