<?php
include_once '../Models/Reaccion.php';

class ReaccionDAO {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getLikesCountByPublicacion(int $idPublicacion): int {
        try {
            $query = "SELECT COUNT(*) as cnt FROM Reaccion WHERE IdPublicacion = ?";
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
            error_log('Error en ReaccionDAO::getLikesCountByPublicacion: ' . $e->getMessage());
            return 0;
        }
    }

    public function getUsersWhoLikedByPublicacion(int $idPublicacion, int $limit = 20): array {
        try {
            $query = "SELECT u.IdUsuario, u.Nombre, u.ApellidoPaterno, u.FotoPerfil, r.IdReaccion, r.FechaReaccion
                      FROM Reaccion r
                      JOIN Usuario u ON r.IdUsuario = u.IdUsuario
                      WHERE r.IdPublicacion = ?
                      ORDER BY r.IdReaccion DESC
                      LIMIT ?";

            $stmt = mysqli_prepare($this->conn, $query);
            mysqli_stmt_bind_param($stmt, 'ii', $idPublicacion, $limit);
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
            return $users;
        } catch (Exception $e) {
            error_log('Error en ReaccionDAO::getUsersWhoLikedByPublicacion: ' . $e->getMessage());
            return [];
        }
    }

    public function userHasLiked(int $idPublicacion, int $idUsuario): bool {
        try {
            $query = "SELECT COUNT(*) as cnt FROM Reaccion WHERE IdPublicacion = ? AND IdUsuario = ?";
            $stmt = mysqli_prepare($this->conn, $query);
            mysqli_stmt_bind_param($stmt, 'ii', $idPublicacion, $idUsuario);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            $has = false;
            if ($result && $row = mysqli_fetch_assoc($result)) {
                $has = ((int)$row['cnt'] > 0);
                mysqli_free_result($result);
            }
            mysqli_stmt_close($stmt);
            return $has;
        } catch (Exception $e) {
            error_log('Error en ReaccionDAO::userHasLiked: ' . $e->getMessage());
            return false;
        }
    }

    public function addLike(int $idPublicacion, int $idUsuario): bool {
        try {
            $query = "INSERT INTO Reaccion (IdUsuario, IdPublicacion) VALUES (?, ?)";
            $stmt = mysqli_prepare($this->conn, $query);
            mysqli_stmt_bind_param($stmt, 'ii', $idUsuario, $idPublicacion);
            $ok = mysqli_stmt_execute($stmt);
            mysqli_stmt_close($stmt);
            return $ok;
        } catch (Exception $e) {
            error_log('Error en ReaccionDAO::addLike: ' . $e->getMessage());
            return false;
        }
    }

    public function removeLike(int $idPublicacion, int $idUsuario): bool {
        try {
            $query = "DELETE FROM Reaccion WHERE IdPublicacion = ? AND IdUsuario = ?";
            $stmt = mysqli_prepare($this->conn, $query);
            mysqli_stmt_bind_param($stmt, 'ii', $idPublicacion, $idUsuario);
            $ok = mysqli_stmt_execute($stmt);
            mysqli_stmt_close($stmt);
            return $ok;
        } catch (Exception $e) {
            error_log('Error en ReaccionDAO::removeLike: ' . $e->getMessage());
            return false;
        }
    }
}