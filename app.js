const express = require("express");
const app = express();
const config = require("./constants/config");
const port = config.port;

const mongo = require("./src/connections/mongoRoutes");

app.use(express.json()); //Returns middleware that only parses JSON and only looks at requests where the Content-Type header matches the type option
app.use(express.urlencoded({ extended: true })); //Returns middleware that only parses {urlencoded} bodies and only looks at requests where the Content-Type header matches the type option. This parser accepts only UTF-8 encoding of the body
app.set("trust proxy", 1);

mongo.routesconfig(app);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
