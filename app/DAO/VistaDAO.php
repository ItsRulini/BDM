<?php
include_once '../Models/Vista.php';

class VistaDAO {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getViewsCountByPublicacion(int $idPublicacion): int {
        try {
            $query = "SELECT COUNT(*) as cnt FROM Vista WHERE IdPublicacion = ?";
            $stmt = mysqli_prepare($this->conn, $query);
            mysqli_stmt_bind_param($stmt, 'i', $idPublicacion);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            $count = 0;
            if ($result && $row = mysqli_fetch_assoc($result)) {
                $count = (int)$row['cnt'];
                mysqli_free_result($result);
            }
            mysqli_stmt_close($stmt);
            return $count;
        } catch (Exception $e) {
            error_log('Error en VistaDAO::getViewsCountByPublicacion: ' . $e->getMessage());
            return 0;
        }
    }

    public function addView(int $idPublicacion, ?int $idUsuario = null): bool {
        try {
            if ($idUsuario === null) {
                $query = "INSERT INTO Vista (IdUsuario, IdPublicacion) VALUES (NULL, ?)";
                $stmt = mysqli_prepare($this->conn, $query);
                mysqli_stmt_bind_param($stmt, 'i', $idPublicacion);
            } else {
                $query = "INSERT INTO Vista (IdUsuario, IdPublicacion) VALUES (?, ?)";
                $stmt = mysqli_prepare($this->conn, $query);
                mysqli_stmt_bind_param($stmt, 'ii', $idUsuario, $idPublicacion);
            }

            $ok = mysqli_stmt_execute($stmt);
            mysqli_stmt_close($stmt);
            return $ok;
        } catch (Exception $e) {
            error_log('Error en VistaDAO::addView: ' . $e->getMessage());
            return false;
        }
    }
}