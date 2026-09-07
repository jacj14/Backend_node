const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

// Middlewares nativos de Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

//     MÉTODO GET
const getUsuario = (req, res) => {
  pool.query("SELECT * FROM usuarios ORDER BY id ASC", (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json(results.rows);
  });
};

//     MÉTODO POST
const crearUsuario = (req, res) => {
  const { nombre, edad, tipo } = req.body;

  if (!nombre || !edad || !tipo) {
    return res.status(400).json({ error: "Faltan datos obligatorios en el body" });
  }

  pool.query(
    "INSERT INTO usuarios (nombre, edad, tipo) VALUES ($1, $2, $3)",
    [nombre, edad, tipo],
    (error) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(201).json({ mensaje: "Usuario agregado correctamente" });
    }
  );
};

//     MÉTODO PUT
const actualizarUsuario = (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, edad, tipo } = req.body;

  if (!nombre || !edad || !tipo) {
    return res.status(400).json({ error: "Faltan datos obligatorios en el body" });
  }

  pool.query(
    "UPDATE usuarios SET nombre = $1, edad = $2, tipo = $3 WHERE id = $4",
    [nombre, edad, tipo, id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (results.rowCount === 0) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }

      res.status(200).json({ mensaje: "Usuario actualizado correctamente" });
    }
  );
};

//     MÉTODO DELETE
const eliminarUsuario = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query("DELETE FROM usuarios WHERE id = $1", [id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (results.rowCount === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
  });
};

//     RUTAS
app.get("/", (req, res) => {
  res.json({ Resultado: "Bienvenido al Taller Despliegue Rest - Railway" });
});

app.get("/usuarios", getUsuario);
app.post("/usuarios", crearUsuario);
app.put("/usuarios/:id", actualizarUsuario);
app.delete("/usuarios/:id", eliminarUsuario);

//     SERVIDOR
const port = process.env.PORT || 1337;

app.listen(port, () => {
  console.log("El servidor está inicializado en http://localhost:%d", port);
});
