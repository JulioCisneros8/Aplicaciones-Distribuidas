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

const nodemailer = require("nodemailer");
var pinCollection = 0;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function prepareDB() {
  dbName = "myDatabaseProyectos";
  collectionName = "Usuarios";

  // Create references to the database and collection in order to run
  // operations on them.
  database = client.db(dbName);
  collection = database.collection(collectionName);

  pinCollection = database.collection("Pines");
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

const crypto = require("crypto");
function hashPassword(password) {
  return crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
}

function generarPIN() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "pablohdz2211@gmail.com",
    pass: "ucolrlosuupjgjyn"
  }
});
async function enviarPIN(correo, pin) {
  await transporter.sendMail({
    from: "pablohdz2211@gmail.com",
    to: correo,
    subject: "Código de verificación",
    text: `Tu PIN de acceso es: ${pin}. Expira en 3 minutos.`
  });
}

app.post("/receipt/insert", async function (req, res) {
  let result = "";

  try {
    const proyecto = req.body;

    if (!proyecto.usuario || !proyecto.nombre || !proyecto.correo || !proyecto.password) {
      return res.json({
        error: "Faltan campos obligatorios",
      });
    }
    proyecto.password = hashPassword(proyecto.password);
    proyecto.created = true;
    proyecto.deleted = false;

    const insertResult = await collection.insertOne(proyecto);

    console.log("Usuario insertado con ID:", insertResult.insertedId);

    result = {
      message: "Usuario insertado correctamente",
      insertedId: insertResult.insertedId,
    };
  } catch (err) {
    console.error("Error al insertar:", err);
    result = {
      error: "Error al insertar el usuario",
      details: err.message,
    };
  }

  res.json(result);
});

app.delete("/receipt/delete/:id", async function (req, res) {
  let result = "";

  try {
    const id = req.params.id;

    if (!id) {
      return res.json({
        error: "Se requiere el usuario",
      });
    }

    const deleteResult = await collection.deleteOne({ usuario: id });

    if (deleteResult.deletedCount === 0) {
      result = {
        message: "No se encontró ningún usuario con ese número",
      };
    } else {
      result = {
        message: "Usuario eliminado correctamente",
      };
    }
  } catch (err) {
    console.error("Error al eliminar:", err);
    result = {
      error: "Error al eliminar el usuario",
      details: err.message,
    };
  }

  res.json(result);
});

app.put("/receipt/update/:id", async function (req, res) {
  let result = "";

  try {
    const id = req.params.id;
    const nuevosDatos = req.body;

    if (!id) {
      return res.json({
        error: "Se requiere el usuario",
      });
    }

    if (nuevosDatos.password) {
      nuevosDatos.password = hashPassword(nuevosDatos.password);
    }

    const updateResult = await collection.updateOne(
      { usuario: id },
      { $set: nuevosDatos }
    );

    if (updateResult.matchedCount === 0) {
      result = {
        message: "No se encontró ningún usuario con ese número",
      };
    } else {
      result = {
        message: "Usuario actualizado correctamente",
      };
    }
  } catch (err) {
    console.error("Error al actualizar:", err);
    result = {
      error: "Error al actualizar el usuario",
      details: err.message,
    };
  }

  res.json(result);
});

app.put("/receipt/delete/:id", async function (req, res) {
  let result = "";

  try {
    const id = req.params.id;

    const updateResult = await collection.updateOne(
      { usuario: id },
      { $set: { deleted: true } }
    );

    if (updateResult.matchedCount === 0) {
      result = {
        message: "No se encontró el usuario",
      };
    } else {
      result = {
        message: "Usuario eliminado lógicamente",
      };
    }
  } catch (err) {
    result = {
      error: err.message,
    };
  }

  res.json(result);
});

app.get("/receipt/get", async function (req, res) {
  let result = "";

  try {
    //const proyectos = await collection.find({}).toArray();
    const proyectos = await collection.find({ deleted: false }).toArray();

    result = {
      data: proyectos,
    };
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    result = {
      error: "Error al obtener los usuarios",
      details: err.message,
    };
  }

  res.json(result);
});

app.post("/receipt/login", async function (req, res) {
  let result = {};

  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.json({
        valido: 0,
        error: "Faltan datos"
      });
    }

    const passwordHash = hashPassword(password);

    const user = await collection.findOne({
      usuario: usuario,
      password: passwordHash,
      deleted: false
    });

    if (!user) {
      return res.json({
        valido: 0,
        message: "Usuario o contraseña incorrectos"
      });
    }

    const pin = generarPIN();

    const fechaCreacion = new Date();
    const fechaExpiracion = new Date(
      fechaCreacion.getTime() + 3 * 60 * 1000
    );

    await pinCollection.insertOne({
      usuario: usuario,
      pin: pin,
      createdAt: fechaCreacion,
      expiresAt: fechaExpiracion,
      used: false
    });

    await enviarPIN(user.correo, pin);

    result = {
      valido: 2,
      message: "PIN enviado al correo"
    };

  } catch (err) {
    result = {
      valido: 0,
      error: err.message
    };
  }

  res.json(result);
});

app.post("/receipt/verifypin", async function (req, res) {
  let result = {};

  try {
    const { usuario, pin } = req.body;

    if (!usuario || !pin) {
      return res.json({
        valido: 0,
        error: "Faltan datos"
      });
    }

    const registroPIN = await pinCollection.findOne({
      usuario: usuario,
      pin: pin,
      used: false
    });

    if (!registroPIN) {
      return res.json({
        valido: 0,
        message: "PIN incorrecto"
      });
    }

    if (new Date() > new Date(registroPIN.expiresAt)) {
      return res.json({
        valido: 0,
        message: "PIN expirado"
      });
    }

    await pinCollection.updateOne(
      { _id: registroPIN._id },
      { $set: { used: true } }
    );

    result = {
      valido: 1,
      message: "Login completo"
    };

  } catch (err) {
    result = {
      valido: 0,
      error: err.message
    };
  }

  res.json(result);
});

app.listen(3000, function () {
  console.log("Aplicación ejemplo, escuchando el puerto 3000!");
  connectDB();
  prepareDB();
});