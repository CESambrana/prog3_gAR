const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

process.loadEnvFile();

const db = require("./db/db");
const v1Routes = require("./rutas/v1/index");

const app = express();

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Clínica Médica API",
            version: "1.0.0",
            description: "API REST para el sistema de gestión de clínica médica"
        },
        servers: [{ url: "http://localhost:3000" }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ["./src/rutas/v1/*.js", "./src/rutas/v1/usuariosRoutes"]
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

// TEST DB
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS conectado");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use("/api/v1", v1Routes);

const PUERTO = process.env.PUERTO || 3000;
app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});