<?php
include_once '../Models/Comentario.php';

class ComentarioDAO {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getCommentsCountByPublicacion(int $idPublicacion): int {
        try {
            $query = "CALL sp_cantidad_comentarios_pub(?)";
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

            // Limpiar resultados extra del CALL
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
            }

            return $count;

        } catch (Exception $e) {
            error_log('Error en ComentarioDAO::getCommentsCountByPublicacion: ' . $e->getMessage());
            return 0;
        }
    }

    public function getRecentCommentsByPublicacion(int $idPublicacion): array {
        try {
            $query = "CALL sp_comentarios_recientes_pub(?)";
            $stmt = mysqli_prepare($this->conn, $query);

            mysqli_stmt_bind_param($stmt, 'i', $idPublicacion);
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
                        'id'   => (int)$row['IdComentario'],
                        'text' => $row['Comentario'],
                        'date' => $row['FechaComentario'],
                        'user' => [
                            'id'         => (int)$row['IdUsuario'],
                            'name'       => trim($row['Nombre'] . ' ' . $row['ApellidoPaterno']),
                            'fotoPerfil' => $foto
                        ]
                    ];
                }
                mysqli_free_result($result);
            }

            mysqli_stmt_close($stmt);

            // Limpiar resultados pendientes del CALL
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
            }

            return $comments;

        } catch (Exception $e) {
            error_log('Error en ComentarioDAO::getRecentCommentsByPublicacion: ' . $e->getMessage());
            return [];
        }
    }


    public function addComment(int $idPublicacion, int $idUsuario, string $texto): ?array {
        try {

            $query = "CALL sp_add_comment(?, ?, ?)";
            $stmt = mysqli_prepare($this->conn, $query);

            mysqli_stmt_bind_param($stmt, 'iis', $idPublicacion, $idUsuario, $texto);
            mysqli_stmt_execute($stmt);

            $result = mysqli_stmt_get_result($stmt);
            $ret = null;

            if ($result && $row = mysqli_fetch_assoc($result)) {

                $foto = null;
                if (!empty($row['FotoPerfil'])) {
                    $foto = 'data:image/jpeg;base64,' . base64_encode($row['FotoPerfil']);
                }

                $ret = [
                    'id'   => (int)$row['IdComentario'],
                    'text' => $row['Comentario'],
                    'date' => $row['FechaComentario'],
                    'user' => [
                        'id'         => (int)$row['IdUsuario'],
                        'name'       => trim($row['Nombre'] . ' ' . $row['ApellidoPaterno']),
                        'fotoPerfil' => $foto
                    ]
                ];

                mysqli_free_result($result);
            }

            mysqli_stmt_close($stmt);

            // Limpiar resultados restantes del CALL
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
            }

            return $ret;

        } catch (Exception $e) {
            error_log('Error en ComentarioDAO::addComment: ' . $e->getMessage());
            return null;
        }
    }


    public function deleteComment(int $idComentario): bool {
        try {
            $query = "CALL sp_eliminar_comentario(?)";
            $stmt = mysqli_prepare($this->conn, $query);

            mysqli_stmt_bind_param($stmt, 'i', $idComentario);
            $ok = mysqli_stmt_execute($stmt);

            mysqli_stmt_close($stmt);

            // Limpiar resultados pendientes del CALL
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
            }

            return $ok;

        } catch (Exception $e) {
            error_log('Error en ComentarioDAO::deleteComment: ' . $e->getMessage());
            return false;
        }
    }

}