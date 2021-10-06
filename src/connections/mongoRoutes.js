const mongo = require("./mongo");

exports.routesconfig = function (app) {
  app.post("/createCollection", [mongo.createCollection]);
  app.post("/dropCollection", [mongo.deleteCollection]);
  app.post("/insertData", [mongo.insertData]);
  app.post("/updateData", [mongo.updateData]);
  app.post("/deleteData", [mongo.deleteData]);
  app.get("/fetchAll", [mongo.fetchAll]);
  app.get("/fetchOne", [mongo.fetchOne]);
};
