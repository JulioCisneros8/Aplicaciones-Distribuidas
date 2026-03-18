// npm install express
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
var express = require("express");
var app = express(); //Contenedor de Endpoints o WS Restful
const { MongoClient } = require("mongodb");
var client = 0;

var dbName = "";
var collectionName = "";

// Create references to the database and collection in order to run
// operations on them.
var database = 0;
var collection = 0;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function prepareDB() {
  dbName = "myDatabaseProyectos";
  collectionName = "proyectos";

  // Create references to the database and collection in order to run
  // operations on them.
  database = client.db(dbName);
  collection = database.collection(collectionName);
}

async function connectDB() {
  const uri =
    "mongodb+srv://jlcsrrios08_db_user:TIL8obYMQg5B7Yg1@cluster0.midoj2i.mongodb.net/?appName=Cluster0";

  client = new MongoClient(uri);

  // The connect() method does not attempt a connection; instead it instructs
  // the driver to connect using the settings provided when a connection
  // is required.
  await client.connect();
}

app.get("/", async function (request, response) {
  r = {
    message: "Nothing to send",
  };

  response.json(r);
});

/*
Calling this service sending payload as parameters in URL: 
https://typesofwebservices.noesierra.repl.co/serv001?id=Nope&token=2345678dhuj43567fgh&geo=123456789,1234567890
*/
app.get("/serv001", async function (req, res) {
  const user_id = req.query.id;
  const token = req.query.token;
  const geo = req.query.geo;

  r = {
    user_id: user_id,
    token: token,
    geo: geo,
  };

  res.json(r);
});

/*
Calling this service sending payload as parameters in URL: 
https://typesofwebservices.noesierra.repl.co/serv001?id=Nope&token=2345678dhuj43567fgh&geo=123456789,1234567890
*/
app.get("/serv0010", async function (req, res) {
  const user_id1 = req.query.id;
  const token1 = req.query.token;
  const geo1 = req.query.geo;

  r1 = {
    user_id: user_id1,
    token: token1,
    geo: geo1,
  };

  res.json(r1);
});

// Call this service sending payload in body: raw - json
/*
{
    "id": "nope",
    "token": "ertydfg456Dfgwerty",
    "geo": "12345678,34567890"
}
*/
app.post("/serv002", async function (req, res) {
  const user_id = req.body.id;
  const token = req.body.token;
  const geo = req.body.geo;

  r = {
    user_id: user_id,
    token: token,
    geo: geo,
  };

  res.json(r);
});

/*
Call this service sending parameter as a part of the URL
https://typesofwebservices.noesierra.repl.co/serv003/1234567
*/
app.post("/serv003/:info", async function (req, res) {
  const info = req.params.info;
  let r = { info: info };
  res.json(r);
});

app.post("/receipt/insert", async function (req, res) {
  let result = "";

  try {
    const proyecto = req.body;

    if (!proyecto.nombre || !proyecto.descripcion || !proyecto.autores || !proyecto.asesores || !proyecto.presupuesto) {
      return res.json({
        error: "Faltan campos obligatorios",
      });
    }

    const insertResult = await collection.insertOne(proyecto);

    console.log("Proyecto insertado con ID:", insertResult.insertedId);

    result = {
      message: "Proyecto insertado correctamente",
      insertedId: insertResult.insertedId,
    };
  } catch (err) {
    console.error("Error al insertar:", err);
    result = {
      error: "Error al insertar el proyecto",
      details: err.message,
    };
  }

  res.json(result);
});

app.listen(3000, function () {
  console.log("Aplicación ejemplo, escuchando el puerto 3000!");
  connectDB();
  prepareDB();
});