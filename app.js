console.log("web serverni boshladik");
const express=require("express");
const app=express();
const router = require("./router");       //router.jsni chaqirib olayopmz.
const router_bssr=require("./router_bssr.js");
const cookieParser = require("cookie-parser");


let session=require("express-session");  // express sessionni chaqirib oldik.
const MongoDBStore=require("connect-mongodb-session")(session);         // mongodbni storej classini  hosil q.
const store=new MongoDBStore({                           // MongoDBStore orqali (store) objectini yasadik
    uri: process.env.MONGO_URL,                                      // MONGO_URL ni process.env ichidan olib berayopmiz
    collection: "sessions",                                 // session azuntikeyshin  orqali collectionni hosil qilayopmiz
});

// 1: Kirish code
// Har qanday browserdan kelayotgan requestlar un public folder ochiq degani.
app.use(express.static("public"));
//json formatdagi datani objectga exchange qilish.
app.use(express.json());
//html formatdan qabul qilinadigan datalarni serverga kiritish
app.use(express.urlencoded({extended: true}));
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


module.exports=app;