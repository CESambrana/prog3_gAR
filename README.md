# Clínica Médica - API REST

API REST para el sistema de gestión de una clínica médica. Permite administrar usuarios, médicos, pacientes, especialidades, obras sociales y turnos, con autenticación JWT y control de acceso por roles.

## Integrantes del Grupo AR

- Cristian Emmanuel Sambrana
- Linda Galeano
- Luciana Espil


## Roles del Sistema

| Rol | Descripción |
|-----|-------------|
| 1   | Médico      |
| 2   | Paciente    |
| 3   | Administrador |

## Endpoints Principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/v1/auth/login` | Login, devuelve JWT |
| GET | `/api/v1/usuarios` | Listar usuarios (admin) |
| GET | `/api/v1/medicos` | Listar médicos |
| GET | `/api/v1/pacientes` | Listar pacientes (admin) |
| GET | `/api/v1/especialidades` | Listar especialidades |
| GET | `/api/v1/obras-sociales` | Listar obras sociales |
| GET | `/api/v1/turnos-reservas` | Listar turnos (admin) |
| GET | `/api/v1/turnos-reservas/mis-turnos` | Turnos propios (médico/paciente) |
| POST | `/api/v1/turnos-reservas` | Reservar turno |
| PATCH | `/api/v1/turnos-reservas/:id/atendido` | Marcar atendido (médico) |
| GET | `/api/v1/estadisticas` | Estadísticas en JSON (admin) |
| GET | `/api/v1/estadisticas/pdf` | Informe PDF (admin) |

Todos los endpoints (excepto login) requieren el header:
```
Authorization: Bearer <token>
```
