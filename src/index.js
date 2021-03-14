const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");

// ? auth
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("./config/passport");

require("dotenv").config({ path: "variables.env" });

const app = express();

// ? db
const db = require("./config/db");
require("./models/Usuarios");
require("./models/Categorias");
require("./models/Grupos");
require("./models/Meeti");
require("./models/Comentarios");
db.sync()
	.then(() => console.log("db is connected"))
	.catch((error) => console.log(error));

// ? settings
app.set("port", process.env.PORT || 4000);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayouts);
app.set("layout", path.join(__dirname, `views/layout/layout`));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ? static files
app.use(express.static(path.join(__dirname, "public")));

// ? session
app.use(
	session({
		secret: process.env.SECRETO,
		key: process.env.KEY,
		resave: false,
		saveUninitialized: false,
	})
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// ? middlwares
app.use((req, res, next) => {
	res.locals.mensajes = req.flash();
	res.locals.user = req.user || {};
	res.locals.year = new Date().getFullYear();
	next();
});

// ? routes
app.use(require("./routes/index.routes"));

app.listen(app.get("port"), () => {
	console.log("Server on PORT", app.get("port"));
});
