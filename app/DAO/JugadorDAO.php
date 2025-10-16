<?php
include_once '../Models/Jugador.php';

class JugadorDAO {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    // Crear un nuevo jugador
    public function crearJugador(Jugador $jugador): ?int {
        // Usamos la sintaxis de MySQLi para llamar al Stored Procedure
        $sql = "CALL sp_crearJugador(?, ?, ?, ?, @p_idJugador)";
    
        try {
            $stmt = $this->conn->prepare($sql);
        
            if ($stmt === false) {
                // La preparación de la consulta falló
                throw new Exception("Error al preparar la consulta: " . $this->conn->error);
            }

            $nombre = $jugador->getNombre();
            $nacionalidad = $jugador->getNacionalidad();
            $fechaNacimiento = $jugador->getFechaNacimiento();
            $foto = $jugador->getFoto();
            $null = NULL; // Variable para vincular el blob

            // LA LÍNEA CLAVE: Esta es la sintaxis correcta para MySQLi
            // 'siss' significa String, Integer, String, String
            $stmt->bind_param('siss', $nombre, $nacionalidad, $fechaNacimiento, $foto);

            // Lógica para enviar datos BLOB (imágenes) en MySQLi
            if ($foto !== null) {
                $stmt->send_long_data(3, $foto); // 3 porque es el 4to '?', y se cuenta desde 0
            }

            $stmt->execute();
        
            // Obtenemos el valor del parámetro de salida (OUT)
            $resultado = $this->conn->query("SELECT @p_idJugador AS id");
            $fila = $resultado->fetch_assoc();

            if ($fila && isset($fila['id'])) {
                return (int)$fila['id'];
            }
        
            return null;

        } catch (Exception $e) {
            // Para depurar: error_log("Error en JugadorDAO (MySQLi): " . $e->getMessage());
            return null;
        }
    }


    // Obtener todos los jugadores
    public function getJugadores(): ?array {
        $sql = "CALL sp_getJugadores()";
    
        try {
            $stmt = $this->conn->prepare($sql);
            if ($stmt === false) {
                throw new Exception("Error al preparar la consulta: " . $this->conn->error);
            }

            $stmt->execute();
            $resultado = $stmt->get_result();
        
            $jugadores = []; // Array para guardar los resultados

            while ($fila = $resultado->fetch_assoc()) {
                $jugador = new Jugador();
                $jugador->setIdJugador($fila['IdJugador']);
                $jugador->setNombre($fila['Nombre']);
                $jugador->setFoto($fila['Foto']);
                // Nota: El modelo Jugador guarda el ID de la nacionalidad, no el nombre.
                $jugador->setNacionalidad($fila['IdNacionalidad']); 
                $jugador->setFechaNacimiento($fila['FechaNacimiento']);
            
                // Guardamos el objeto jugador en nuestro array
                $jugadores[] = $jugador;
            }

            return $jugadores;

        } catch (Exception $e) {
            // error_log("Error en getJugadores (MySQLi): " . $e->getMessage());
            return null;
        }
    }
}