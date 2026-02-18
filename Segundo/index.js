var express = require('express');
var app = express(); //Contenedor de Endpoints o WS Restful

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async function (request, response) {

    r ={
      'message':'Nothing to send'
    };

    response.json(r);
});

app.post("/fragmenta", async function (req, res) {

    const { id, lat, long } = req.body;

    // Convertir a número
    const latNum = parseFloat(lat);
    const longNum = parseFloat(long);

    // ENTERAS
    const lat_i_e = Math.trunc(latNum);
    const long_i_e = Math.trunc(longNum);

    // DECIMALES
    const lat_d_e = Math.abs(latNum - lat_i_e);
    const long_d_e = Math.abs(longNum - long_i_e);

    const r = {
        id_e: id,
        lat_i_e: lat_i_e,
        lat_d_e: lat_d_e,
        long_i_e: long_i_e,
        long_d_e: long_d_e
    };

    res.json(r);
});

app.listen(3000, function() {
    console.log('Aplicación ejemplo, escuchando el puerto 3000!');
});