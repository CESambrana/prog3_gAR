const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./middlewares/errorHandler");
const registrarAuditoria = require("./middlewares/auditoria");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

process.loadEnvFile();

const v1Routes = require("./rutas/v1/index");

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { status: false, mensaje: 'Demasiadas solicitudes desde esta IP, intente más tarde' }
});

// middlewares
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(morgan("dev"));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(registrarAuditoria);

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

app.use("/api/v1", v1Routes);

app.use(errorHandler);

const PUERTO = process.env.PUERTO || 3000;
app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});