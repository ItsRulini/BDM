<?php

include_once '../Models/Usuario.php';

class UsuarioDAO {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }


    public function getUsuarioPorCorreo($correo) {
        try {
            $query = "CALL sp_obtenerUsuarioPorCorreo(?)";
            $stmt = mysqli_prepare($this->conn, $query);
            mysqli_stmt_bind_param($stmt, 's', $correo);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);

            if ($result && mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_assoc($result);
                $usuario = new Usuario();
                $usuario->setIdUsuario($row['IdUsuario']);
                $usuario->setCorreo($row['Correo']);
                $usuario->setContraseña($row['Contraseña']);
                $usuario->setNombre($row['Nombre']);
                $usuario->setApellidoPaterno($row['ApellidoPaterno']);
                $usuario->setApellidoMaterno($row['ApellidoMaterno']);
                $usuario->setGenero($row['Genero']);
                $usuario->setGeneroEspecifico($row['GeneroEspecifico']);
                $usuario->setNacionalidad($row['Nacionalidad']);
                $usuario->setPaisNacimiento($row['PaisNacimiento']);
                $usuario->setTipo($row['Tipo']);
                $usuario->setFotoPerfil($row['FotoPerfil']);
                $usuario->setFechaNacimiento($row['FechaNacimiento']);
                return $usuario;
            }
        } catch (mysqli_sql_exception $e) {
            echo "Error: " . $e->getMessage();
            return null;
        }
        return null;
    }
    public function createUsuario(Usuario $usuario) {
        try {
            $query = "CALL sp_crearUsuario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            $stmt = mysqli_prepare($this->conn, $query);

            $null = NULL; // Placeholder para datos BLOB nulos

            $correo = $usuario->getCorreo();
            $contraseña = $usuario->getContraseña();
            $nombre = $usuario->getNombre();
            $apellidoPaterno = $usuario->getApellidoPaterno();
            $apellidoMaterno = $usuario->getApellidoMaterno();
            $genero = $usuario->getGenero();
            $generoEspecifico = $usuario->getGeneroEspecifico();
            $nacionalidad = $usuario->getNacionalidad();
            $paisNacimiento = $usuario->getPaisNacimiento();
            $tipo = $usuario->getTipo();
            $fechaNacimiento = $usuario->getFechaNacimiento();

            if ($stmt) {
                // Bind de parámetros
                if (!mysqli_stmt_bind_param(
                    $stmt,
                    'sssssssiissb', // Cambiado el orden: BLOB al final
                    $correo,
                    $contraseña,
                    $nombre,
                    $apellidoPaterno,
                    $apellidoMaterno,
                    $genero,
                    $generoEspecifico,
                    $nacionalidad,
                    $paisNacimiento,
                    $tipo,
                    $fechaNacimiento,
                    $fotoPerfil
                )) {
                    throw new Exception("Error al vincular parámetros: " . mysqli_stmt_error($stmt));
                }

                // Enviar datos BLOB si existe
                if ($fotoPerfil !== null) {
                    if (!mysqli_stmt_send_long_data($stmt, 11, $fotoPerfil)) { // 11 es el índice del BLOB (último parámetro)
                        error_log("Warning: Error al enviar datos BLOB: " . mysqli_stmt_error($stmt));
                    }
                }

                // Ejecutar
                if (!mysqli_stmt_execute($stmt)) {
                    $error = mysqli_stmt_error($stmt);
                    $errno = mysqli_stmt_errno($stmt);
                    throw new Exception("Error al ejecutar el procedimiento almacenado: $error (Código: $errno)");
                }

                // Obtener el ID del usuario recién insertado
                $lastInsertId = mysqli_insert_id($this->conn);
            
                // Cerrar statement
                mysqli_stmt_close($stmt);
                $usuario->setIdUsuario($lastInsertId);
                return $usuario;
            }
        } catch (mysqli_sql_exception $e) {
            echo "Error: " . $e->getMessage();
            return null;
        }

        return null;
    }

}