

const path = require('path');
const multer = require('multer');
const uuid = require('uuid');


const product_storage = multer.diskStorage({ // documentatinga kura diskstorageni yasab olib product storagega tenglashtirib olayoman.
   // sababi storagni ichiga past qilishimiz kerak.
    destination: function (req, file, cb) {       //destination orqali qayerga yuklashni kursatayopmz req bulayopti fileni olayopti.
        cb(null, './uploads/products' );                // uploads folderini ichiga products fileni yukladik.
    },
    filename: function(req, file,cb) {
        console.log(file);
        const extension = path.parse(file.originalname).ext;  // extension methodni chaqirib olib pathdegan packgeda
        // parse metodni kirib file nomini kiritib ext bu rasm orqasidagi  jpeg belgi.

       const random_name = uuid.v4() + extension;

       cb(null,random_name );  //callback functionda uuid.v4  bizga rendim qiymatni hosil qilib beradi son va harfdan iborat.
    },
});

module.exports.uploadProductImage = multer({ storage: product_storage });