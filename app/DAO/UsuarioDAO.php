<?php

include_once '../Models/Usuario.php';

class UsuarioDAO {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getUsuarioPorCorreo($correo): ?array {
        try {
            $query = "CALL sp_obtenerUsuarioPorCorreo(?)";
            $stmt = mysqli_prepare($this->conn, $query);
            mysqli_stmt_bind_param($stmt, 's', $correo);
            mysqli_stmt_execute($stmt);

            $result = mysqli_stmt_get_result($stmt);
            if (!$result) {
                mysqli_stmt_close($stmt);
                mysqli_next_result($this->conn);
                return null;
            }

            if ($row = mysqli_fetch_assoc($result)) {
                $usuario = new Usuario();
                $usuario->setIdUsuario($row['IdUsuario']);
                $usuario->setCorreo($row['Correo']);
                $usuario->setContraseña($row['Contraseña']);
                $usuario->setNombre($row['Nombre']);
                $usuario->setApellidoPaterno($row['ApellidoPaterno']);
                $usuario->setApellidoMaterno($row['ApellidoMaterno']);
                $usuario->setGenero($row['Genero']);
                $usuario->setTipo($row['Tipo']);
                $usuario->setFotoPerfil($row['FotoPerfil']);
                $usuario->setFechaNacimiento($row['FechaNacimiento']);
                $usuario->setPaisNacimiento($row['IdPaisNacimiento']);
                $usuario->setNacionalidad($row['IdNacionalidad']);
                
                $userData = [
                    'usuario' => $usuario,
                    'nacionalidad' => $row['Nacionalidad'],
                    'paisNacimiento' => $row['PaisNacimiento']
                ];

                mysqli_free_result($result);
                mysqli_stmt_close($stmt);
                mysqli_next_result($this->conn);
                return $userData;
            }

            mysqli_free_result($result);
            mysqli_stmt_close($stmt);
            mysqli_next_result($this->conn);
            return null;

        } catch (mysqli_sql_exception $e) {
            error_log("Error en getUsuarioPorCorreo: " . $e->getMessage());
            return null;
        }
    }

    public function createUsuario(Usuario $usuario): ?Usuario
    {
        try {
            $query = "CALL sp_crearUsuario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = mysqli_prepare($this->conn, $query);

            if (!$stmt) throw new Exception("Error al preparar la consulta: " . mysqli_error($this->conn));
            
            $correo = $usuario->getCorreo();
            $contraseña = $usuario->getContraseña();
            $nombre = $usuario->getNombre();
            $apellidoPaterno = $usuario->getApellidoPaterno();
            $apellidoMaterno = $usuario->getApellidoMaterno();
            $genero = $usuario->getGenero();
            $nacionalidad = $usuario->getNacionalidad();
            $paisNacimiento = $usuario->getPaisNacimiento();
            $tipo = $usuario->getTipo();
            $fotoPerfil = $usuario->getFotoPerfil();
            $fechaNacimiento = $usuario->getFechaNacimiento();
            $null = NULL;

            mysqli_stmt_bind_param(
                $stmt, 'ssssssiisbs',
                $correo, $contraseña, $nombre, $apellidoPaterno, $apellidoMaterno,
                $genero, $nacionalidad, $paisNacimiento, $tipo,
                $null, $fechaNacimiento
            );

            if ($fotoPerfil !== null) {
                mysqli_stmt_send_long_data($stmt, 9, $fotoPerfil);
            }

            if (!mysqli_stmt_execute($stmt)) {
                throw new Exception("Error al ejecutar sp_crearUsuario: " . mysqli_stmt_error($stmt));
            }
            mysqli_stmt_close($stmt);

            $queryId = "SELECT IdUsuario FROM Usuario WHERE Correo = ?";
            $stmtId = mysqli_prepare($this->conn, $queryId);
            mysqli_stmt_bind_param($stmtId, 's', $correo);
            mysqli_stmt_execute($stmtId);
            $resultId = mysqli_stmt_get_result($stmtId);
            
            if ($row = mysqli_fetch_assoc($resultId)) {
                $newId = $row['IdUsuario'];
                $usuario->setIdUsuario($newId);
                mysqli_stmt_close($stmtId);
                return $usuario;
            }

            mysqli_stmt_close($stmtId);
            return null;
            
        } catch (Exception $e) {
            error_log("Error en UsuarioDAO::createUsuario: " . $e->getMessage());
            return null;
        }
    }

    // ACTUALIZAR INFORMACIÓN DEL USUARIO (sin contraseña)
    public function updateUsuario(Usuario $usuario): bool
    {
        try {
            $query = "CALL sp_updateUsuario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = mysqli_prepare($this->conn, $query);

            if (!$stmt) {
                throw new Exception("Error al preparar la consulta de actualización: " . mysqli_error($this->conn));
            }

            $idUsuario = $usuario->getIdUsuario();
            $nombre = $usuario->getNombre();
            $apellidoPaterno = $usuario->getApellidoPaterno();
            $apellidoMaterno = $usuario->getApellidoMaterno();
            $correo = $usuario->getCorreo();
            $genero = $usuario->getGenero();
            $fechaNacimiento = $usuario->getFechaNacimiento();
            $nacionalidad = $usuario->getNacionalidad();
            $paisNacimiento = $usuario->getPaisNacimiento();
            $fotoPerfil = $usuario->getFotoPerfil();
            
            $null = NULL;

            mysqli_stmt_bind_param(
                $stmt,
                'issssssiib', // 10 parámetros (sin contraseña)
                $idUsuario,
                $nombre,
                $apellidoPaterno,
                $apellidoMaterno,
                $correo,
                $genero,
                $fechaNacimiento,
                $nacionalidad,
                $paisNacimiento,
                $null
            );

            if ($fotoPerfil !== null) {
                mysqli_stmt_send_long_data($stmt, 9, $fotoPerfil);
            }

            if (mysqli_stmt_execute($stmt)) {
                mysqli_stmt_close($stmt);
                mysqli_next_result($this->conn); // Limpiar resultados pendientes
                return true;
            } else {
                throw new Exception("Error al ejecutar la actualización: " . mysqli_stmt_error($stmt));
            }

        } catch (Exception $e) {
            error_log("Error en UsuarioDAO::updateUsuario: " . $e->getMessage());
            return false;
        }
    }

    // NUEVO MÉTODO PARA ACTUALIZAR SOLO LA CONTRASEÑA
    public function updateContrasena(int $idUsuario, string $nuevaContrasena): bool
    {
        try {
            $query = "CALL sp_updateContrasena(?, ?)";
            $stmt = mysqli_prepare($this->conn, $query);

            if (!$stmt) {
                throw new Exception("Error al preparar la consulta: " . mysqli_error($this->conn));
            }

            mysqli_stmt_bind_param($stmt, 'is', $idUsuario, $nuevaContrasena);

            if (mysqli_stmt_execute($stmt)) {
                mysqli_stmt_close($stmt);
                mysqli_next_result($this->conn);
                return true;
            } else {
                throw new Exception("Error al actualizar contraseña: " . mysqli_stmt_error($stmt));
            }

        } catch (Exception $e) {
            error_log("Error en UsuarioDAO::updateContrasena: " . $e->getMessage());
            return false;
        }
    }
}