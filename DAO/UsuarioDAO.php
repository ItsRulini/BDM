<?php

require_once 'Connection/conn.php';
require_once 'Models/Usuario.php';

class UsuarioDAO {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function createUsuario(Usuario $usuario) {
        
        try{
            $query = "INSERT INTO usuarios (correo, contraseña, nombre, apellidoPaterno, apellidoMaterno, genero, generoEspecifico, nacionalidad, paisNacimiento, tipo, fotoPerfil, fechaNacimiento, fechaRegistro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = mysqli_prepare($this->conn, $query);

            if ($stmt) {
                mysqli_stmt_bind_param($stmt, 'ssssssiiissss',
                    $usuario->getCorreo(),
                    $usuario->getContraseña(),
                    $usuario->getNombre(),
                    $usuario->getApellidoPaterno(),
                    $usuario->getApellidoMaterno(),
                    $usuario->getGenero(),
                    $usuario->getGeneroEspecifico(),
                    $usuario->getNacionalidad(),
                    $usuario->getPaisNacimiento(),
                    $usuario->getTipo(),
                    $usuario->getFotoPerfil(),
                    $usuario->getFechaNacimiento(),
                    $usuario->getFechaRegistro()
                );
                if (mysqli_stmt_execute($stmt)) {
                    $usuario->setIdUsuario(mysqli_insert_id($this->conn));
                    mysqli_stmt_close($stmt);
                    return $usuario;
                }
                mysqli_stmt_close($stmt);
            }
        } catch (mysqli_sql_exception $e) {
            echo "Error: " . $e->getMessage();
            return null;
        }
        
        
        return null;
    }

}