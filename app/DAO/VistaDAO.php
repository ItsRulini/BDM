<?php
include_once '../Models/Vista.php';

class VistaDAO {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getViewsCountByPublicacion(int $idPublicacion): int {
        try {
            $query = "CALL sp_cantidad_vistas_pub(?)";
            $stmt = mysqli_prepare($this->conn, $query);
            mysqli_stmt_bind_param($stmt, 'i', $idPublicacion);
            mysqli_stmt_execute($stmt);

            $result = mysqli_stmt_get_result($stmt);
            $count = 0;
            if ($result && $row = mysqli_fetch_assoc($result)) {
                $count = (int)$row['cnt'];
            }

            mysqli_free_result($result);
            mysqli_stmt_close($stmt);

            // IMPORTANTE EN CALLs: limpiar resultados pendientes
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
            }

            return $count;
        } catch (Exception $e) {
            error_log('Error en VistaDAO::getViewsCountByPublicacion: ' . $e->getMessage());
            return 0;
        }
    }

    public function addView(int $idPublicacion, ?int $idUsuario = null): bool {
        try {
            $query = "CALL sp_insert_vista(?, ?)";
            $stmt = mysqli_prepare($this->conn, $query);

            mysqli_stmt_bind_param($stmt, 'ii', $idUsuario,$idPublicacion);
            mysqli_stmt_execute($stmt);

            $ok = mysqli_stmt_affected_rows($stmt) > 0;

            mysqli_stmt_close($stmt);

            // Limpiar resultados extra del CALL
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
            }

            return $ok;
        } catch (Exception $e) {
            error_log('Error en VistaDAO::addView: ' . $e->getMessage());
            return false;
        }
    }
}