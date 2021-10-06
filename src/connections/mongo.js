const mongo = require("mongodb").MongoClient;
const config = require("../../constants/config");
var err_flag = 0;

exports.createCollection = (req, response) => {
  mongo.connect(
    config.url,
    { useUnifiedTopology: true, useNewUrlParser: true },
    function (err, db) {
      if (!err) {
        console.log("connection created.", req.body);
        if (req.body?.dbName) {
          try {
            var dbo = db.db(req.body.dbName);
            _db = dbo;
            dbo.createCollection(req.body.collectionName, function (err, res) {
              if (err) {
                console.log("error while collection creation: ", err);
                response.send(
                  "Couldn't create collection as it already exists."
                );
                db.close();
              } else {
                console.log("Collection created!", res.collectionName);

                response.send({
                  dbName: req.body.dbName,
                  collectionName: req.body.collectionName,
                  status: "created",
                });
                db.close();
              }
            });
          } catch (error) {
            console.log("error -> ", error);
            db.close();
          }
        } else {
          console.log("no dbName");
          db.close();
        }
      } else {
        console.log("error while connecting: ", err);
      }
    }
  );
};

exports.deleteCollection = (req, response) => {
  mongo.connect(
    config.url,
    { useUnifiedTopology: true, useNewUrlParser: true },
    function (err, db) {
      if (!err) {
        console.log("connection created.", req.body);
        if (req.body?.dbName) {
          try {
            var dbo = db.db(req.body.dbName);
            _db = dbo;
            dbo.dropCollection(req.body.collectionName, function (err, res) {
              if (err) {
                console.log("error while collection dropping:", err);
                response.send("Collection doesn't exist");
              } else {
                console.log("Collection dropped!", res.collectionName);
                db.close()
                  .then(() =>
                    response.send({
                      dbName: req.body.dbName,
                      collectionName: req.body.collectionName,
                      status: "dropped",
                    })
                  )
                  .catch((err) => {
                    console.log("err -> ", err);
                    db.close();
                  });
              }
            });
          } catch (error) {
            console.log("error -> ", error);
            db.close();
          }
        } else {
          console.log("no dbName");
          db.close();
        }
      } else {
        console.log("error while connecting: ", err);
      }
    }
  );
};

exports.insertData = (req, response) => {
  mongo.connect(
    config.url,
    { useUnifiedTopology: true, useNewUrlParser: true },
    async function (err, db) {
      if (!err) {
        if (req.body?.dbName) {
          try {
            var dbo = db.db(req.body.dbName);
            var dbo_collection = dbo.collection(req.body?.collectionName);
            var items = await dbo_collection.find({}).toArray();
            console.log("items length ->", items.length);
            if (items.length !== 0) {
              var flag = 0;
              for (var i = 0; i < items.length; i++) {
                console.log("items.name", i, ":", items[i].name);
                if (items[i].name === req.body?.dataToBeInserted?.name) {
                  console.log("raising flag");
                  flag = 1;
                  break;
                }
              }
              if (!flag) {
                dbo
                  .collection(req.body?.collectionName)
                  .insertOne(req.body.dataToBeInserted, function (err, obj) {
                    console.log("inserting ->", req.body.dataToBeInserted);
                    if (!err) {
                      console.log(JSON.stringify(obj) + " record(s) inserted");
                    } else {
                      err_flag = 1;
                    }
                    db.close();
                  });
                if (!err_flag) {
                  response.send(
                    "Record inserted:" +
                      JSON.stringify(req.body.dataToBeInserted)
                  );
                } else {
                  response.send("Couldn't insert record." + err);
                }
              } else {
                response.send(
                  "username: " +
                    req.body.dataToBeInserted.name +
                    " already taken. Choose another and try again!"
                );
                db.close();
              }
            } else {
              dbo
                .collection(req.body?.collectionName)
                .insertOne(req.body.dataToBeInserted, function (err, obj) {
                  console.log("inserting ->", req.body.dataToBeInserted);
                  if (!err) {
                    response.send(
                      "Record inserted:" +
                        JSON.stringify(req.body.dataToBeInserted)
                    );
                  } else {
                    err_flag = 1;
                  }
                  db.close();
                });
            }
          } catch (error) {
            response.send("something went wrong -> " + error);
            db.close();
          }
        } else {
          response.send("Enter a valid dbname");
          db.close();
        }
      } else {
        response.send("couldn't create connection");
      }
    }
  );
};

exports.updateData = (req, response) => {
  mongo.connect(
    config.url,
    { useUnifiedTopology: true, useNewUrlParser: true },
    async function (err, db) {
      if (!err) {
        var dbo = db.db(req.body.dbName);
        var coll_list = await dbo
          .collection(req.body.collectionName)
          .find({})
          .toArray();
        var flag = 0;
        for (var i = 0; i < coll_list.length; i++) {
          if (coll_list[i].name === req.body.name) {
            flag = 1;
            break;
          }
        }
        if (flag) {
          dbo
            .collection(req.body.collectionName)
            .updateOne(
              { name: req.body.name },
              { $set: { pass: req.body.pass } },
              function (err, data) {
                if (!err) {
                  response.send(
                    "Record with name: " + req.body.name + " updated!"
                  );
                } else {
                  response.send("Couldn't update record!");
                }
                db.close();
              }
            );
        } else {
          response.send("Record Doesn't exist!");
          db.close();
        }
      } else {
        response.send("Couldn't create a connection!");
      }
    }
  );
};

exports.deleteData = (req, response) => {
  if (req.body.type === "one" || req.body.type === "many") {
    mongo.connect(
      config.url,
      { useUnifiedTopology: true, useNewUrlParser: true },
      function (err, db) {
        if (!err) {
          var dbo = db.db(req.body.dbName);
          if (req.body.type === "one") {
            dbo
              .collection(req.body?.collectionName)
              .deleteOne({ name: req.body?.name }, function (err, obj) {
                if (!err) {
                  if (obj.deletedCount)
                    response.send(obj.deletedCount + " record deleted");
                  else
                    response.send(
                      "Invalid 'name' passed or key 'name' doesn't exist."
                    );
                } else {
                  response.send("error while deleting one record: " + err);
                  console.log("error while deleting one record: ", err);
                }
                db.close();
              });
          } else if (req.body.type === "many") {
            dbo
              .collection(req.body?.collectionName)
              .deleteMany({ name: req.body?.name }, function (err, obj) {
                if (!err) {
                  if (obj.deletedCount)
                    response.send(obj.deletedCount + " record(s) deleted");
                  else
                    response.send(
                      "Invalid 'name' passed or key 'name' doesn't exist."
                    );
                } else {
                  response.send("error while deleting many records: " + err);
                  console.log("error while deleting many records: ", err);
                }
                db.close();
              });
          }
        } else {
          response.send("Couldn't build a connection.");
        }
      }
    );
  } else {
    response.send("Enter a valid type");
  }
};

exports.fetchAll = (req, response) => {
  mongo.connect(
    config.url,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
    async function (err, db) {
      if (req.query?.dbName) {
        var dbo = db.db(req.query.dbName);
        var coll_list = await dbo
          .collection(req.query?.collectionName)
          .find({})
          .toArray();
        response.send(coll_list);
        db.close();
      } else {
        response.send("Key 'dbName' doesn't exist.");
        db.close();
      }
    }
  );
};

exports.fetchOne = (req, response) => {
  if (req.query?.collectionName && req.query?.dbName) {
    mongo.connect(
      config.url,
      { useUnifiedTopology: true, useNewUrlParser: true },
      async function (err, db) {
        if (req.query?.name) {
          var dbo = db.db(req.query.dbName);
          var response_data = await dbo
            .collection(req.query.collectionName)
            .find({ name: req.query.name })
            .toArray();
          response.send(response_data[0]);
          db.close();
        } else {
          response.send("Record Doesn't Exist!");
          db.close();
        }
      }
    );
  } else {
    response.send("Please enter both collectionName and dbName!");
  }
};
