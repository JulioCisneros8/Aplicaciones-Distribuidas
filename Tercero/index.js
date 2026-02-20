const express = require("express");
const crypto = require("crypto");

const app = express();
app.use(express.json());

function ok(res, data) {
  return res.status(200).json({ ok: true, ...data });
}
function badRequest(res, message) {
  return res.status(400).json({ ok: false, error: message });
}

function requireString(obj, key) {
  if (!obj || typeof obj[key] !== "string") return false;
  return true;
}

// i) Mascaracteres: recibe dos cadenas y regresa la que tenga más caracteres.
app.post("/mascaracteres", (req, res) => {
  const b = req.body;
  if (!requireString(b, "a") || !requireString(b, "b")) {
    return badRequest(res, "Se requieren parámetros JSON: { a: string, b: string }");
  }
  const result = b.a.length >= b.b.length ? b.a : b.b;
  return ok(res, { result });
});

// ii) Menoscaracteres: recibe dos cadenas y regresa la que tenga menos caracteres.
app.post("/menoscaracteres", (req, res) => {
  const b = req.body;
  if (!requireString(b, "a") || !requireString(b, "b")) {
    return badRequest(res, "Se requieren parámetros JSON: { a: string, b: string }");
  }
  const result = b.a.length <= b.b.length ? b.a : b.b;
  return ok(res, { result });
});

// iii) Numcaracteres: recibe una cadena y regresa el número de caracteres que la cadena tiene
app.post("/numcaracteres", (req, res) => {
  const b = req.body;
  if (!requireString(b, "text")) {
    return badRequest(res, "Se requiere JSON: { text: string }");
  }
  return ok(res, { length: b.text.length });
});

// iv) Palindroma: recibe una cadena y regresa true/false
app.post("/palindroma", (req, res) => {
  const b = req.body;
  if (!requireString(b, "text")) {
    return badRequest(res, "Se requiere JSON: { text: string }");
  }
  const normalized = b.text.toLowerCase().replace(/\s+/g, "");
  const reversed = normalized.split("").reverse().join("");
  const isPalindrome = normalized === reversed;
  return ok(res, { isPalindrome });
});

// v) Concat: recibe dos cadenas y regresa concatenación iniciando con el primer parámetro
app.post("/concat", (req, res) => {
  const b = req.body;
  if (!requireString(b, "a") || !requireString(b, "b")) {
    return badRequest(res, "Se requieren parámetros JSON: { a: string, b: string }");
  }
  return ok(res, { result: b.a + b.b });
});

// vi) Applysha256: recibe una cadena, aplica SHA256 y regresa la original y la encriptada
app.post("/applysha256", (req, res) => {
  const b = req.body;
  if (!requireString(b, "text")) {
    return badRequest(res, "Se requiere JSON: { text: string }");
  }
  const hash = sha256Hex(b.text);
  return ok(res, { original: b.text, sha256: hash });
});

// SHA256 helper
function sha256Hex(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

// vii) verifysha256: recibe una cadena encriptada y una normal, a la normal le aplica SHA256 y compara
app.post("/verifysha256", (req, res) => {
  const b = req.body;
  if (!requireString(b, "plain") || !requireString(b, "hash")) {
    return badRequest(res, "Se requiere JSON: { plain: string, hash: string }");
  }
  const computed = sha256Hex(b.plain);
  const matches = computed === b.hash;
  return ok(res, { matches });
});

// Puerto
app.listen(3000, function() {
  console.log(`Aplicacion ejemplo, escuchando en el puerto 3000!`);
});