<?php

require_once 'Connection/conn.php';
require_once 'Models/Usuario.php';

class UsuarioDAO {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function createUsuario(Usuario $usuario) {
        try {
            $query = "CALL sp_crearUsuario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            $stmt = mysqli_prepare($this->conn, $query);

            if ($stmt) {
                // Bind de los parámetros
                mysqli_stmt_bind_param($stmt,
                    'sssssssiisbs',
                    $usuario->getCorreo(),
                    $usuario->getContraseña(),
                    $usuario->getNombre(),
                    $usuario->getApellidoPaterno(),
                    $usuario->getApellidoMaterno(),
                    $usuario->getGenero(),
                    $usuario->getGeneroEspecifico(),
                    $usuario->getNacionalidad(),   // INT
                    $usuario->getPaisNacimiento(), // INT
                    $usuario->getTipo(),
                    $null, // placeholder para fotoPerfil (BLOB)
                    $usuario->getFechaNacimiento()
                );

                // FotoPerfil (BLOB) → índice 10 (porque es el 11º parámetro, empieza en 0)
                $foto = $usuario->getFotoPerfil(); 
                mysqli_stmt_send_long_data($stmt, 10, $foto);

                if (mysqli_stmt_execute($stmt)) {
                    mysqli_stmt_close($stmt);
                    return $usuario; // El SP se ejecutó correctamente
                }

                mysqli_stmt_close($stmt);
            }
        } catch (mysqli_sql_exception $e) {
            echo "Error: " . $e->getMessage();
            return null;
        }

        return $usuario;
    }

}