<?php
include_once '../Models/Comentario.php';

class ComentarioDAO {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getCommentsCountByPublicacion(int $idPublicacion): int {
        try {
            $query = "SELECT COUNT(*) as cnt FROM Comentario WHERE IdPublicacion = ? AND Estatus = 1";
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
            error_log('Error en ComentarioDAO::getCommentsCountByPublicacion: ' . $e->getMessage());
            return 0;
        }
    }

    public function getRecentCommentsByPublicacion(int $idPublicacion, int $limit = 10): array {
        try {
            $query = "SELECT c.IdComentario, c.Comentario, c.FechaComentario, u.IdUsuario, u.Nombre, u.ApellidoPaterno, u.FotoPerfil
                      FROM Comentario c
                      JOIN Usuario u ON c.IdUsuario = u.IdUsuario
                      WHERE c.IdPublicacion = ? AND c.Estatus = 1
                      ORDER BY c.FechaComentario DESC
                      LIMIT ?";

            $stmt = mysqli_prepare($this->conn, $query);
            mysqli_stmt_bind_param($stmt, 'ii', $idPublicacion, $limit);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            $comments = [];
            if ($result) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $foto = null;
                    if (!empty($row['FotoPerfil'])) {
                        $foto = 'data:image/jpeg;base64,' . base64_encode($row['FotoPerfil']);
                    }
                    $comments[] = [
                        'id' => (int)$row['IdComentario'],
                        'text' => $row['Comentario'],
                        'date' => $row['FechaComentario'],
                        'user' => [
                            'id' => (int)$row['IdUsuario'],
                            'name' => trim($row['Nombre'] . ' ' . $row['ApellidoPaterno']),
                            'fotoPerfil' => $foto
                        ]
                    ];
                }
                mysqli_free_result($result);
            }
            mysqli_stmt_close($stmt);
            return $comments;
        } catch (Exception $e) {
            error_log('Error en ComentarioDAO::getRecentCommentsByPublicacion: ' . $e->getMessage());
            return [];
        }
    }

    public function addComment(int $idPublicacion, int $idUsuario, string $texto): ?array {
        try {
            $query = "INSERT INTO Comentario (Comentario, IdUsuario, IdPublicacion) VALUES (?, ?, ?)";
            $stmt = mysqli_prepare($this->conn, $query);
            mysqli_stmt_bind_param($stmt, 'sii', $texto, $idUsuario, $idPublicacion);
            if (!mysqli_stmt_execute($stmt)) {
                mysqli_stmt_close($stmt);
                return null;
            }
            mysqli_stmt_close($stmt);

            // Obtener el comentario insertado junto con datos de usuario
            $query2 = "SELECT c.IdComentario, c.Comentario, c.FechaComentario, u.IdUsuario, u.Nombre, u.ApellidoPaterno, u.FotoPerfil
                       FROM Comentario c
                       JOIN Usuario u ON c.IdUsuario = u.IdUsuario
                       WHERE c.IdPublicacion = ?
                       ORDER BY c.IdComentario DESC
                       LIMIT 1";

            $stmt2 = mysqli_prepare($this->conn, $query2);
            mysqli_stmt_bind_param($stmt2, 'i', $idPublicacion);
            mysqli_stmt_execute($stmt2);
            $result = mysqli_stmt_get_result($stmt2);
            $ret = null;
            if ($result && $row = mysqli_fetch_assoc($result)) {
                $foto = null;
                if (!empty($row['FotoPerfil'])) $foto = 'data:image/jpeg;base64,' . base64_encode($row['FotoPerfil']);
                $ret = [
                    'id' => (int)$row['IdComentario'],
                    'text' => $row['Comentario'],
                    'date' => $row['FechaComentario'],
                    'user' => [
                        'id' => (int)$row['IdUsuario'],
                        'name' => trim($row['Nombre'] . ' ' . $row['ApellidoPaterno']),
                        'fotoPerfil' => $foto
                    ]
                ];
                mysqli_free_result($result);
            }
            mysqli_stmt_close($stmt2);
            return $ret;
        } catch (Exception $e) {
            error_log('Error en ComentarioDAO::addComment: ' . $e->getMessage());
            return null;
        }
    }

    public function deleteComment(int $idComentario): bool {
        try {
            $query = "UPDATE Comentario SET Estatus = 0 WHERE IdComentario = ?";
            $stmt = mysqli_prepare($this->conn, $query);
            mysqli_stmt_bind_param($stmt, 'i', $idComentario);
            $result = mysqli_stmt_execute($stmt);
            mysqli_stmt_close($stmt);
            return $result;
        } catch (Exception $e) {
            error_log('Error en ComentarioDAO::deleteComment: ' . $e->getMessage());
            return false;
        }
    }
}