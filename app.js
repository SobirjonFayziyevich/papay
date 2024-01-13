console.log("web serverni boshladik");
const http=require("http");
const express=require("express");
const app=express();
const router = require("./router");       //router.jsni chaqirib olayopmz.
const router_bssr=require("./router_bssr.js");
const cookieParser = require("cookie-parser");
const cors = require('cors'); 


let session=require("express-session");  // express sessionni chaqirib oldik.
const MongoDBStore=require("connect-mongodb-session")(session);         // mongodbni storej classini  hosil q.
const store=new MongoDBStore({                           // MongoDBStore orqali (store) objectini yasadik
    uri: process.env.MONGO_URL,                                      // MONGO_URL ni process.env ichidan olib berayopmiz
    collection: "sessions",                                 // session azuntikeyshin  orqali collectionni hosil qilayopmiz
});

// 1: Kirish code
// Har qanday browserdan kelayotgan requestlar un public folder ochiq degani.
app.use(express.static("public"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/uploads", express.static(__dirname + "/uploads")); //uploadsni ichidagi malunotlarni tugridan tugri uqishga.
//json formatdagi datani objectga exchange qilish.
app.use(express.json());
//html formatdan qabul qilinadigan datalarni serverga kiritish
app.use(express.urlencoded({extended: true}));
app.use(
    cors({  //faqat URL dan keladigan malumotlarni qabul qilsin degani.
        credentials: true,
        origin: true, //har qanday domein (joydan)kelayotgan requestni qabul qilsin.
    })
);
app.use(cookieParser());

// 2: Session code
app.use(
    session({
        secret: process.env.SESSION_SECRET,  // secret kodimizni joyladik.
        cookie: {
            maxAge: 1000 * 60 * 30,           // malumt 30 minutgacha cookieda aqlanib turadi.
        },
        store: store,                         // store storeda saqlansin
        resave: true,
        saveUninitialized: true,
    })
);

// har bir kelayotgan req un mantiq yozsak.
app.use(function (req, res, next) {
    res.locals.member = req.session.member;
    next();
})


// 3: Views code
//ejs orqali backend ni ichida frontendni yasash.
app.set("views", "views");
app.set("view engine", "ejs",);  //ejs - backendda frontendni qurishda yordam beradi.

// 4 Routing code
app.use("/", router); //expressga router.js ni bogladik.//XARIDORLAR un kerak bulgan frontend loyihasi.
app.use("/resto", router_bssr); // Asosan(ADMINvaRESTAUTANT USER)lari un kerakli loyiha.

// **  SOKET.IO BACKEND SERVER  ***************
const server = http.createServer(app); // bu yerda app bjjulgan boiz, app ni moduledn export qilmayman.
const io = require("socket.io")(server, { // buyerda qushimcha shartlar kiritib oldim.socket.io docuentatinda yuq mantiq.
  serveClient: false,
  origins: "*:*",     // clientni server qilmyman, originsni hamma portga ochaman. "*:*"=> ixtiyotiy kelgan ulanishi mumkin degani.
  transport: ["websocket", "xhr-polling"],  // transport pratakolini yozdim,
});
let online_users = 0; // onlain userlarni sonini kiritish
io.on("connection", function (socket) { // kimdir bizni serverga ulansa xabar shu yerga keladi degani.
  online_users++;     // onlain userlar soni bittaga oshsin.
  console.log(("new user, total:", online_users));  // yangi user qushildi

  // socket.emit degani=> manashu ulangan odam un yozilgan xabar.
  socket.emit("greetMsg", { text: "welcome" }); //socket.emitni postmanda greetMsg deb nomladik. xabarga welcom dedim
  io.emit("infoMsg", { total: online_users }); // io.emit=> hamma odamga userlar sonini share qildim. va uyerda onlain userlar soni buladi.

  socket.on("disconnect", function () {  // ulangan userimiz boglanolmaganda,
    online_users--; // onlain userlar sonini kamaytirish kerak.
    socket.broadcast.emit("infoMsg", { total: online_users }); // socket.broadcast.emit=> ulangan odamdan tashqari qolgan odamlar.  
    console.log(("client disconnected, total:", online_users)); // serverda malumotlar kurinishida onlain userlar sonni kiritdim. 
  });

  socket.on("createMsg", function (data) { // biror bir user xabar yozsin, yani createMsg kirib kelgan vaqtda 
    console.log("createMsg:",  data); // uyerdan malumot abul qilsin.
    io.emit("newMsg", data); //  io.emmet=> hamma bog'lanuvchilarga degani.
    // malumotni hamma qabul qilsin. data bu qabul
  });
});

// socket.emit(); => sending msg to connected one user
// socket.broadcast.emit(); => sending msg to other users, except that ONE USER
// io.emit(); => ending msg to all users

// finish: SOCKET.IO BACKEND SERVER

module.exports = server; 