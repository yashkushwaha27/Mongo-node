const express = require("express");
const app = express();
const config = require("./constants/config");
const bodyParser = require("body-parser");
// var mongo = require("mongodb").MongoClient;
// var Mongoose = require("mongoose");
const port = config.port;
const url = config.url;
var _db;

const mongo = require("./src/connections/mongoRoutes");

app.get("/", (req, res) => {
  res.send("Hello " + config.username + "!");
});

// function mongooseConnection() {
//   console.log("mongooseConnection called");
//   Mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
//   var db = Mongoose.connection;
//   db.on("error", console.error.bind(console, "connection error:"));
//   db.once("open", function callback() {
//     console.log("----- connected -----");
//   });
// }

// function mongodbConnection() {
//   console.log("in mongo db");
// mongo.connect(url, function (err, client) {
//   if (err) {
//     console.log("------ CAN NOT CONNECT TO MONGO DB URL ---------", url);
//   } else {
//     _db = client.db("mongoosetest");
//     console.log("------CONNECT TO MONGO DB URL ---------", url);
//   }
// });
// mongo.connect(
//   url + "mongoDB_test",
//   { useUnifiedTopology: true, useNewUrlParser: true },
//   function (err, db) {
//     if (err) console.log("error while connecting: ", err);
//     var dbo = db.db("mongoosetest");
//     _db = dbo;
//     dbo.createCollection("customers", function (err, res) {
//       if (err) {
//         console.log("error while collection creation: ", err);
//       } else {
//         console.log("Collection created!", res.collectionName);
//         db.close()
//           .then(() => console.log("connection closed"))
//           .catch((err) => console.log("err -> ", err));
//       }
//     });
//   }
// );
// }

app.use(express.json()); //Returns middleware that only parses JSON and only looks at requests where the Content-Type header matches the type option
app.use(express.urlencoded({ extended: true })); //Returns middleware that only parses {urlencoded} bodies and only looks at requests where the Content-Type header matches the type option. This parser accepts only UTF-8 encoding of the body
app.set("trust proxy", 1);

mongo.routesconfig(app);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
