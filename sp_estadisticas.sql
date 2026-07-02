-- ============================================================
-- Stored Procedures para estadísticas de atenciones (Admin)
-- TFI Programación III - Clínica Médica
-- Todas las estadísticas del sistema se generan exclusivamente
-- a través de estos procedimientos almacenados.
-- ============================================================

DELIMITER $$

-- ------------------------------------------------------------
-- 1. sp_estadisticas_atenciones
-- Cantidad de turnos y facturación del mes anterior, agrupado
-- por especialidad
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_estadisticas_atenciones$$
CREATE PROCEDURE sp_estadisticas_atenciones()
BEGIN
    SELECT
        e.id_especialidad,
        e.nombre AS especialidad,
        COUNT(tr.id_turno_reserva) AS cantidad_turnos,
        COALESCE(SUM(tr.valor_total), 0) AS facturacion_total
    FROM especialidades e
    LEFT JOIN medicos m
        ON e.id_especialidad = m.id_especialidad
    LEFT JOIN turnos_reservas tr
        ON m.id_medico = tr.id_medico
        AND MONTH(tr.fecha_hora) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
        AND tr.activo = 1
    WHERE e.activo = 1
    GROUP BY e.id_especialidad, e.nombre
    ORDER BY cantidad_turnos DESC;
END$$

-- ------------------------------------------------------------
-- 2. sp_estadisticas_por_obra_social
-- Cantidad de turnos y facturación agrupados por obra social
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_estadisticas_por_obra_social$$
CREATE PROCEDURE sp_estadisticas_por_obra_social()
BEGIN
    SELECT
        os.id_obra_social,
        os.nombre AS obra_social,
        os.es_particular,
        COUNT(tr.id_turno_reserva) AS cantidad_turnos,
        COALESCE(SUM(tr.valor_total), 0) AS facturacion_total
    FROM obras_sociales os
    LEFT JOIN turnos_reservas tr
        ON os.id_obra_social = tr.id_obra_social
        AND tr.activo = 1
    WHERE os.activo = 1
    GROUP BY os.id_obra_social, os.nombre, os.es_particular
    ORDER BY cantidad_turnos DESC;
END$$

-- ------------------------------------------------------------
-- 3. sp_estadisticas_por_medico
-- Cantidad de turnos, atendidos/pendientes y facturación por médico
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_estadisticas_por_medico$$
CREATE PROCEDURE sp_estadisticas_por_medico()
BEGIN
    SELECT
        m.id_medico,
        u.apellido AS medico_apellido,
        u.nombres AS medico_nombres,
        e.nombre AS especialidad,
        COUNT(tr.id_turno_reserva) AS cantidad_turnos,
        SUM(CASE WHEN tr.atendido = 1 THEN 1 ELSE 0 END) AS turnos_atendidos,
        SUM(CASE WHEN tr.atendido = 0 THEN 1 ELSE 0 END) AS turnos_pendientes,
        COALESCE(SUM(tr.valor_total), 0) AS facturacion_total
    FROM medicos m
    JOIN usuarios u ON m.id_usuario = u.id_usuario
    JOIN especialidades e ON m.id_especialidad = e.id_especialidad
    LEFT JOIN turnos_reservas tr
        ON m.id_medico = tr.id_medico
        AND tr.activo = 1
    WHERE u.activo = 1
    GROUP BY m.id_medico, u.apellido, u.nombres, e.nombre
    ORDER BY cantidad_turnos DESC;
END$$

-- ------------------------------------------------------------
-- 4. sp_estadisticas_por_paciente
-- Cantidad de turnos y gasto total por paciente
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_estadisticas_por_paciente$$
CREATE PROCEDURE sp_estadisticas_por_paciente()
BEGIN
    SELECT
        p.id_paciente,
        u.apellido AS paciente_apellido,
        u.nombres AS paciente_nombres,
        os.nombre AS obra_social,
        COUNT(tr.id_turno_reserva) AS cantidad_turnos,
        COALESCE(SUM(tr.valor_total), 0) AS gasto_total
    FROM pacientes p
    JOIN usuarios u ON p.id_usuario = u.id_usuario
    JOIN obras_sociales os ON p.id_obra_social = os.id_obra_social
    LEFT JOIN turnos_reservas tr
        ON p.id_paciente = tr.id_paciente
        AND tr.activo = 1
    WHERE u.activo = 1
    GROUP BY p.id_paciente, u.apellido, u.nombres, os.nombre
    ORDER BY cantidad_turnos DESC;
END$$

-- ------------------------------------------------------------
-- 5. sp_estadisticas_por_rango_fechas
-- Detalle de turnos entre dos fechas (para el informe en PDF)
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_estadisticas_por_rango_fechas$$
CREATE PROCEDURE sp_estadisticas_por_rango_fechas(
    IN p_fecha_desde DATE,
    IN p_fecha_hasta DATE
)
BEGIN
    SELECT
        tr.id_turno_reserva,
        tr.fecha_hora,
        tr.valor_total,
        tr.atendido,
        u_m.apellido AS medico_apellido,
        u_m.nombres AS medico_nombres,
        e.nombre AS especialidad,
        u_p.apellido AS paciente_apellido,
        u_p.nombres AS paciente_nombres,
        os.nombre AS obra_social
    FROM turnos_reservas tr
    JOIN medicos m ON tr.id_medico = m.id_medico
    JOIN usuarios u_m ON m.id_usuario = u_m.id_usuario
    JOIN especialidades e ON m.id_especialidad = e.id_especialidad
    JOIN pacientes p ON tr.id_paciente = p.id_paciente
    JOIN usuarios u_p ON p.id_usuario = u_p.id_usuario
    JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
    WHERE tr.activo = 1
      AND DATE(tr.fecha_hora) BETWEEN p_fecha_desde AND p_fecha_hasta
    ORDER BY tr.fecha_hora;
END$$

DELIMITER ;
