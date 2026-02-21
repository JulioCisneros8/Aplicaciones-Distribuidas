const express = require("express");
const app = express();

app.use(express.json());

//Respuesta
function respuesta(res, estado, data) {
  return res.status(estado ? 200 : 400).json({
    estado,
    ...data
  });
}

//Ejercicio 1
app.post("/saludo", (req, res) => {
  const { nombre } = req.body;

  if (!nombre || typeof nombre !== "string") {
    return respuesta(res, false, { error: "Nombre inválido" });
  }

  return respuesta(res, true, {
    mensaje: `Hola, ${nombre}`
  });
});


//Ejercicio 2
app.post("/calcular", (req, res) => {
  const { a, b, operacion } = req.body;

  if (typeof a !== "number" || typeof b !== "number") {
    return respuesta(res, false, { error: "a y b deben ser números" });
  }

  let resultado;

  switch (operacion) {
    case "suma":
      resultado = a + b;
      break;
    case "resta":
      resultado = a - b;
      break;
    case "multiplicacion":
      resultado = a * b;
      break;
    case "division":
      if (b === 0) {
        return respuesta(res, false, { error: "División por cero" });
      }
      resultado = a / b;
      break;
    default:
      return respuesta(res, false, { error: "Operación inválida" });
  }

  return respuesta(res, true, { resultado });
});


//Ejercicio 3
let tareas = [];

app.post("/tareas", (req, res) => {
  const { id, titulo, completada } = req.body;

  if (typeof id !== "number" || typeof titulo !== "string" || typeof completada !== "boolean") {
    return respuesta(res, false, { error: "Datos inválidos" });
  }

  tareas.push({ id, titulo, completada });
  return respuesta(res, true, { mensaje: "Tarea creada" });
});

app.get("/tareas", (req, res) => {
  return respuesta(res, true, { tareas });
});

app.put("/tareas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const tarea = tareas.find(t => t.id === id);

  if (!tarea) {
    return respuesta(res, false, { error: "Tarea no encontrada" });
  }

  Object.assign(tarea, req.body);
  return respuesta(res, true, { mensaje: "Tarea actualizada" });
});

app.delete("/tareas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = tareas.findIndex(t => t.id === id);

  if (index === -1) {
    return respuesta(res, false, { error: "Tarea no encontrada" });
  }

  tareas.splice(index, 1);
  return respuesta(res, true, { mensaje: "Tarea eliminada" });
});


//Ejercicio 4
app.post("/validar-password", (req, res) => {
  const { password } = req.body;

  if (!password || typeof password !== "string") {
    return respuesta(res, false, { error: "Password inválido" });
  }

  const errores = [];

  if (password.length < 8) errores.push("Mínimo 8 caracteres");
  if (!/[A-Z]/.test(password)) errores.push("Debe tener una mayúscula");
  if (!/[a-z]/.test(password)) errores.push("Debe tener una minúscula");
  if (!/[0-9]/.test(password)) errores.push("Debe tener un número");

  return respuesta(res, true, {
    esValida: errores.length === 0,
    errores
  });
});


//Ejercicio 5
app.post("/convertir-temperatura", (req, res) => {
  const { valor, desde, hacia } = req.body;

  if (typeof valor !== "number") {
    return respuesta(res, false, { error: "Valor inválido" });
  }

  let celsius;

  if (desde === "C") celsius = valor;
  else if (desde === "F") celsius = (valor - 32) * 5 / 9;
  else if (desde === "K") celsius = valor - 273.15;
  else return respuesta(res, false, { error: "Escala inválida" });

  let convertido;

  if (hacia === "C") convertido = celsius;
  else if (hacia === "F") convertido = (celsius * 9 / 5) + 32;
  else if (hacia === "K") convertido = celsius + 273.15;
  else return respuesta(res, false, { error: "Escala inválida" });

  return respuesta(res, true, {
    valorOriginal: valor,
    escalaOriginal: desde,
    valorConvertido: convertido,
    escalaConvertida: hacia
  });
});


//Ejercicio 6
app.post("/buscar", (req, res) => {
  const { array, elemento } = req.body;

  if (!Array.isArray(array)) {
    return respuesta(res, false, { error: "Debe enviar un array" });
  }

  const indice = array.indexOf(elemento);

  return respuesta(res, true, {
    encontrado: indice !== -1,
    indice,
    tipoElemento: typeof elemento
  });
});


//Ejercicio 7
app.post("/contar-palabras", (req, res) => {
  const { texto } = req.body;

  if (!texto || typeof texto !== "string") {
    return respuesta(res, false, { error: "Texto inválido" });
  }

  const palabras = texto.trim().split(/\s+/);
  const unicas = new Set(palabras);

  return respuesta(res, true, {
    totalPalabras: palabras.length,
    totalCaracteres: texto.length,
    palabrasUnicas: unicas.size
  });
});

app.listen(3000, function() {
  console.log(`Aplicacion ejemplo, escuchando en el puerto 3000!`);
});