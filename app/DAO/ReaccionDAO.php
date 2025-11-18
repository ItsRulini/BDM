<?php
include_once '../Models/Reaccion.php';

class ReaccionDAO {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getLikesCountByPublicacion(int $idPublicacion): int {
        try {
            $query = "CALL sp_cantidad_likes_pub(?)";
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

            // Limpiar resultados extra del CALL
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
            }

            return $count;
        } catch (Exception $e) {
            error_log('Error en ReaccionDAO::getLikesCountByPublicacion: ' . $e->getMessage());
            return 0;
        }
    }

    public function getUsersWhoLikedByPublicacion(int $idPublicacion): array {
        try {
            $query = "CALL sp_usuarios_likearon_pub(?)";
            $stmt = mysqli_prepare($this->conn, $query);

            mysqli_stmt_bind_param($stmt, 'i', $idPublicacion);
            mysqli_stmt_execute($stmt);

            $result = mysqli_stmt_get_result($stmt);

            $users = [];
            if ($result) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $foto = null;
                    if (!empty($row['FotoPerfil'])) {
                        $foto = 'data:image/jpeg;base64,' . base64_encode($row['FotoPerfil']);
                    }
                    $users[] = [
                        'id' => (int)$row['IdUsuario'],
                        'name' => trim($row['Nombre'] . ' ' . $row['ApellidoPaterno']),
                        'fotoPerfil' => $foto,
                        'date' => isset($row['FechaReaccion']) ? $row['FechaReaccion'] : null
                    ];
                }
                mysqli_free_result($result);
            }

            mysqli_stmt_close($stmt);
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
            }

            return $users;
        } catch (Exception $e) {
            error_log('Error en ReaccionDAO::getUsersWhoLikedByPublicacion: ' . $e->getMessage());
            return [];
        }
    }

    public function userHasLiked(int $idPublicacion, int $idUsuario): bool {
        try {
            $query = "CALL sp_usuario_likeo(?, ?)";
            $stmt = mysqli_prepare($this->conn, $query);

            mysqli_stmt_bind_param($stmt, 'ii', $idUsuario, $idPublicacion);
            mysqli_stmt_execute($stmt);

            $result = mysqli_stmt_get_result($stmt);

            $hasLiked = false;
            if ($result && $row = mysqli_fetch_assoc($result)) {
                $hasLiked = ((int)$row['cnt'] > 0);
                mysqli_free_result($result);
            }

            mysqli_stmt_close($stmt);

            // Limpieza necesaria para CALL
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
            }

            return $hasLiked;

        } catch (Exception $e) {
            error_log('Error en ReaccionDAO::userHasLiked: ' . $e->getMessage());
            return false;
        }
    }


    public function addLike(int $idPublicacion, int $idUsuario): bool {
        try {
            $query = "CALL sp_add_like(?, ?)";
            $stmt = mysqli_prepare($this->conn, $query);

            mysqli_stmt_bind_param($stmt, 'ii', $idUsuario, $idPublicacion);
            mysqli_stmt_execute($stmt);

            // Ver si se insertó correctamente
            $ok = mysqli_stmt_affected_rows($stmt) > 0;

            mysqli_stmt_close($stmt);

            // Limpieza de resultados de CALL
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
            }

            return $ok;

        } catch (Exception $e) {
            error_log('Error en ReaccionDAO::addLike: ' . $e->getMessage());
            return false;
        }
    }

    public function removeLike(int $idPublicacion, int $idUsuario): bool {
        try {
            $query = "CALL sp_remove_like(?, ?)";
            $stmt = mysqli_prepare($this->conn, $query);

            mysqli_stmt_bind_param($stmt, 'ii', $idUsuario, $idPublicacion);
            mysqli_stmt_execute($stmt);

            // Ver si realmente eliminó un registro
            $ok = mysqli_stmt_affected_rows($stmt) > 0;

            mysqli_stmt_close($stmt);

            // Limpiar resultados del CALL
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
            }

            return $ok;

        } catch (Exception $e) {
            error_log('Error en ReaccionDAO::removeLike: ' . $e->getMessage());
            return false;
        }
    }

}