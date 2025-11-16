<?php
include_once '../Models/Publicacion.php';

class PublicacionDAO {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    // Crear publicación
    public function crearPublicacion(Publicacion $publicacion, array $categorias, array $multimedia): ?int {
        try {
            // ⭐ LIMPIAR RESULTADOS PENDIENTES AL INICIO
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
                if ($res = mysqli_store_result($this->conn)) {
                    mysqli_free_result($res);
                }
            }

            $query = "CALL sp_crearPublicacion(?, ?, ?, @idPublicacion)";
            $stmt = mysqli_prepare($this->conn, $query);

            if (!$stmt) {
                throw new Exception("Error al preparar consulta: " . mysqli_error($this->conn));
            }

            $contenido = $publicacion->getContenido();
            $idCreador = $publicacion->getIdCreador();
            $idMundial = $publicacion->getIdMundial();

            mysqli_stmt_bind_param($stmt, 'sii', $contenido, $idCreador, $idMundial);

            if (!mysqli_stmt_execute($stmt)) {
                throw new Exception("Error al crear publicación: " . mysqli_stmt_error($stmt));
            }

            mysqli_stmt_close($stmt);
            
            // ⭐ LIMPIAR RESULTADOS DESPUÉS DE CADA STORED PROCEDURE
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
                if ($res = mysqli_store_result($this->conn)) {
                    mysqli_free_result($res);
                }
            }

            // Obtener ID generado
            $result = mysqli_query($this->conn, "SELECT @idPublicacion as id");
            if (!$result) {
                throw new Exception("Error al obtener ID: " . mysqli_error($this->conn));
            }
            
            $row = mysqli_fetch_assoc($result);
            $idPublicacion = (int)$row['id'];
            mysqli_free_result($result);

            // Asociar categorías
            foreach ($categorias as $idCategoria) {
                $queryCat = "CALL sp_asociarCategoriaPublicacion(?, ?)";
                $stmtCat = mysqli_prepare($this->conn, $queryCat);
                
                if (!$stmtCat) {
                    throw new Exception("Error preparando categoría: " . mysqli_error($this->conn));
                }
                
                mysqli_stmt_bind_param($stmtCat, 'ii', $idPublicacion, $idCategoria);
                
                if (!mysqli_stmt_execute($stmtCat)) {
                    throw new Exception("Error asociando categoría: " . mysqli_stmt_error($stmtCat));
                }
                
                mysqli_stmt_close($stmtCat);
                
                // ⭐ LIMPIAR RESULTADOS
                while (mysqli_more_results($this->conn)) {
                    mysqli_next_result($this->conn);
                    if ($res = mysqli_store_result($this->conn)) {
                        mysqli_free_result($res);
                    }
                }
            }

            // Guardar multimedia
            foreach ($multimedia as $media) {
                $queryMedia = "CALL sp_guardarMultimediaPublicacion(?, ?, @idMultimedia)";
                $stmtMedia = mysqli_prepare($this->conn, $queryMedia);
                
                if (!$stmtMedia) {
                    throw new Exception("Error preparando multimedia: " . mysqli_error($this->conn));
                }
                
                $null = NULL;
                mysqli_stmt_bind_param($stmtMedia, 'bi', $null, $idPublicacion);
                
                if ($media !== null && strlen($media) > 0) {
                    mysqli_stmt_send_long_data($stmtMedia, 0, $media);
                }
                
                if (!mysqli_stmt_execute($stmtMedia)) {
                    throw new Exception("Error guardando multimedia: " . mysqli_stmt_error($stmtMedia));
                }
                
                mysqli_stmt_close($stmtMedia);
                
                // ⭐ LIMPIAR RESULTADOS
                while (mysqli_more_results($this->conn)) {
                    mysqli_next_result($this->conn);
                    if ($res = mysqli_store_result($this->conn)) {
                        mysqli_free_result($res);
                    }
                }
            }

            return $idPublicacion;

        } catch (Exception $e) {
            error_log("Error en crearPublicacion: " . $e->getMessage());
            
            // ⭐ LIMPIAR RESULTADOS EN CASO DE ERROR
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
                if ($res = mysqli_store_result($this->conn)) {
                    mysqli_free_result($res);
                }
            }
            
            return null;
        }
    }

    // Obtener publicaciones por usuario
    public function getPublicacionesPorUsuario(int $idUsuario): ?array {
        try {
            // ⭐ LIMPIAR RESULTADOS PENDIENTES AL INICIO
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
                if ($res = mysqli_store_result($this->conn)) {
                    mysqli_free_result($res);
                }
            }

            $query = "CALL sp_getPublicacionesPorUsuario(?)";
            $stmt = mysqli_prepare($this->conn, $query);
            
            if (!$stmt) {
                throw new Exception("Error preparando consulta: " . mysqli_error($this->conn));
            }
            
            mysqli_stmt_bind_param($stmt, 'i', $idUsuario);
            
            if (!mysqli_stmt_execute($stmt)) {
                throw new Exception("Error ejecutando consulta: " . mysqli_stmt_error($stmt));
            }
            
            $result = mysqli_stmt_get_result($stmt);
            $publicaciones = [];

            if ($result) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $pub = new Publicacion();
                    $pub->setIdPublicacion($row['IdPublicacion']);
                    $pub->setContenido($row['Contenido']);
                    $pub->setFechaCreacion($row['FechaCreacion']);
                    $pub->setFechaAprobacion($row['FechaAprobacion']);
                    $pub->setEstatusAprobacion($row['EstatusAprobacion']);
                    $pub->setIdCreador($row['IdCreador']);
                    $pub->setIdMundial($row['IdMundial']);
                    
                    $publicaciones[] = [
                        'publicacion' => $pub,
                        'mundialAño' => $row['MundialAño']
                    ];
                }
                mysqli_free_result($result);
            }

            mysqli_stmt_close($stmt);
            
            // ⭐ LIMPIAR RESULTADOS
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
                if ($res = mysqli_store_result($this->conn)) {
                    mysqli_free_result($res);
                }
            }

            return $publicaciones;

        } catch (Exception $e) {
            error_log("Error en getPublicacionesPorUsuario: " . $e->getMessage());
            
            // ⭐ LIMPIAR RESULTADOS EN CASO DE ERROR
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
                if ($res = mysqli_store_result($this->conn)) {
                    mysqli_free_result($res);
                }
            }
            
            return null;
        }
    }

    // Aprobar publicación
    public function aprobarPublicacion(int $idPublicacion): bool {
        try {
            // ⭐ LIMPIAR RESULTADOS PENDIENTES
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
                if ($res = mysqli_store_result($this->conn)) {
                    mysqli_free_result($res);
                }
            }

            $query = "CALL sp_aprobarPublicacion(?)";
            $stmt = mysqli_prepare($this->conn, $query);
            mysqli_stmt_bind_param($stmt, 'i', $idPublicacion);
            
            $result = mysqli_stmt_execute($stmt);
            mysqli_stmt_close($stmt);
            
            // ⭐ LIMPIAR RESULTADOS
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
                if ($res = mysqli_store_result($this->conn)) {
                    mysqli_free_result($res);
                }
            }
            
            return $result;
        } catch (Exception $e) {
            error_log("Error en aprobarPublicacion: " . $e->getMessage());
            return false;
        }
    }

    // Rechazar publicación
    public function rechazarPublicacion(int $idPublicacion): bool {
        try {
            // ⭐ LIMPIAR RESULTADOS PENDIENTES
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
                if ($res = mysqli_store_result($this->conn)) {
                    mysqli_free_result($res);
                }
            }

            $query = "CALL sp_rechazarPublicacion(?)";
            $stmt = mysqli_prepare($this->conn, $query);
            mysqli_stmt_bind_param($stmt, 'i', $idPublicacion);
            
            $result = mysqli_stmt_execute($stmt);
            mysqli_stmt_close($stmt);
            
            // ⭐ LIMPIAR RESULTADOS
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
                if ($res = mysqli_store_result($this->conn)) {
                    mysqli_free_result($res);
                }
            }
            
            return $result;
        } catch (Exception $e) {
            error_log("Error en rechazarPublicacion: " . $e->getMessage());
            return false;
        }
    }



    // Obtener multimedia de una publicación
    public function getMultimediaPublicacion(int $idPublicacion): array {
        try {
            // ⭐ NUEVO: Limpiar resultados antes de una consulta SELECT
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
                if ($res = mysqli_store_result($this->conn)) {
                    mysqli_free_result($res);
                }
            }

            $query = "SELECT m.IdMultimedia as id, m.Contenido as contenido
                      FROM Multimedia m
                      INNER JOIN Multimedia_Publicacion mp ON m.IdMultimedia = mp.IdMultimedia
                      WHERE mp.IdPublicacion = ?";
            
            $stmt = mysqli_prepare($this->conn, $query);
            mysqli_stmt_bind_param($stmt, 'i', $idPublicacion);
            mysqli_stmt_execute($stmt);
            
            $result = mysqli_stmt_get_result($stmt);
            $multimedia = [];

            if ($result) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $multimedia[] = $row;
                }
                mysqli_free_result($result);
            }

            mysqli_stmt_close($stmt);
            
            return $multimedia;

        } catch (Exception $e) {
            error_log("Error en getMultimediaPublicacion: " . $e->getMessage());
            return [];
        }
    }

// Obtener categorías de una publicación
    public function getCategoriasPublicacion(int $idPublicacion): array {
        try {
            // ⭐ NUEVO: Limpiar resultados antes de llamar al SP
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
                if ($res = mysqli_store_result($this->conn)) {
                    mysqli_free_result($res);
                }
            }

            // ⭐ MODIFICADO: Usar el Stored Procedure
            $query = "CALL sp_getCategoriasPublicacion(?)";
            
            $stmt = mysqli_prepare($this->conn, $query);
            
            if (!$stmt) {
                throw new Exception("Error preparando consulta: " . mysqli_error($this->conn));
            }
            
            mysqli_stmt_bind_param($stmt, 'i', $idPublicacion);
            
            if (!mysqli_stmt_execute($stmt)) {
                throw new Exception("Error ejecutando consulta: ". mysqli_stmt_error($stmt));
            }

            $result = mysqli_stmt_get_result($stmt);
            $categorias = [];

            if ($result) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $categorias[] = $row['Nombre']; // El SP devuelve 'Nombre'
                }
                mysqli_free_result($result);
            }

            mysqli_stmt_close($stmt);
            
            // ⭐ NUEVO: Limpiar resultados después de llamar al SP
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
                if ($res = mysqli_store_result($this->conn)) {
                    mysqli_free_result($res);
                }
            }

            return $categorias;

        } catch (Exception $e) {
            error_log("Error en getCategoriasPublicacion: " . $e->getMessage());
            
            // ⭐ NUEVO: Limpiar en caso de error
            while (mysqli_more_results($this->conn)) {
                mysqli_next_result($this->conn);
                if ($res = mysqli_store_result($this->conn)) {
                    mysqli_free_result($res);
                }
            }

            return [];
        }
    }

// Obtener todas las publicaciones (para admin)
public function getTodasPublicaciones(): ?array {
    try {
        // Limpiar resultados pendientes
        while (mysqli_more_results($this->conn)) {
            mysqli_next_result($this->conn);
            if ($res = mysqli_store_result($this->conn)) {
                mysqli_free_result($res);
            }
        }

        $query = "CALL sp_getTodasPublicaciones()";
        $stmt = mysqli_prepare($this->conn, $query);
        
        if (!$stmt) {
            throw new Exception("Error preparando consulta: " . mysqli_error($this->conn));
        }
        
        if (!mysqli_stmt_execute($stmt)) {
            throw new Exception("Error ejecutando consulta: " . mysqli_stmt_error($stmt));
        }
        
        $result = mysqli_stmt_get_result($stmt);
        $publicaciones = [];

        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $pub = new Publicacion();
                $pub->setIdPublicacion($row['IdPublicacion']);
                $pub->setContenido($row['Contenido']);
                $pub->setFechaCreacion($row['FechaCreacion']);
                $pub->setFechaAprobacion($row['FechaAprobacion']);
                $pub->setEstatusAprobacion($row['EstatusAprobacion']);
                $pub->setIdCreador($row['IdCreador']);
                $pub->setIdMundial($row['IdMundial']);
                
                $publicaciones[] = [
                    'publicacion' => $pub,
                    'sedes' => $row['Sedes'],
                    'mundialAño' => $row['MundialAño'],
                    'autorNombre' => $row['UsuarioNombre'] . ' ' . $row['UsuarioApellido']
                ];
            }
            mysqli_free_result($result);
        }

        mysqli_stmt_close($stmt);
        
        // Limpiar resultados
        while (mysqli_more_results($this->conn)) {
            mysqli_next_result($this->conn);
            if ($res = mysqli_store_result($this->conn)) {
                mysqli_free_result($res);
            }
        }

        return $publicaciones;

    } catch (Exception $e) {
        error_log("Error en getTodasPublicaciones: " . $e->getMessage());
        
        // Limpiar en caso de error
        while (mysqli_more_results($this->conn)) {
            mysqli_next_result($this->conn);
            if ($res = mysqli_store_result($this->conn)) {
                mysqli_free_result($res);
            }
        }
        
        return null;
    }
}




    
}