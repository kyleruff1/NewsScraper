let express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const request = require("request");
const cheerio = require("cheerio");
//const logger = require("logger");
const app = express();

app.use(express.static("public"));

// set express data parsing
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set handlebars views
//app.engine("handlebars", exphbs({extname: "handlebars", defaultLayout: "main", layoutsDir: __dirname + "/views/layouts" }));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set('views', __dirname + '/views')


// models required
require("./models/notes.js");
require("./models/articles.js");

// setup mongoose connection
const databaseUri = "mongodb://localhost/mongoscraper";
const collections = ["scrapedarticles"];


console.log('MONGODB_URI', process.env.MONGODB_URI)

if (process.env.MONGODB_URI) {
	console.log('remote')
	mongoose.connect(process.env.MONGODB_URI);
} else {
	console.log('remote')
	mongoose.connect(databaseUri);
}

console.log("created new database: ", databaseUri)

//Get the default connection
var db = mongoose.connection;

/// bind connection to error event
db.on('error', function (err) { 
	console.log('MongoDB connection error:', err);
});

// log success once in mongoose
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// routes
const routes = require("./controllers/controllers.js");
app.use("/", routes);

console.log("created new database: ", databaseUri)

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("App running on port 3000!");
});