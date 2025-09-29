<?php
include_once '../Models/Pais.php';

class PaisDAO {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getPaises(): ?array {

        try {
            $query = "CALL sp_obtenerPaises()";
            $stmt = mysqli_prepare($this->conn, $query);

            if (!$stmt) {
                throw new Exception("Error al preparar la consulta: " . mysqli_error($this->conn));
            }

            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);

            $paises = [];

            if ($result) {
                // Itera sobre cada fila del resultado
                while ($row = mysqli_fetch_assoc($result)) {
                    $pais = new Pais();
                    $pais->setIdPais($row['IdPais']);
                    $pais->setPais($row['Pais']);
                    $pais->setNacionalidad($row['Nacionalidad']);
                    $paises[] = $pais; // Agrega el objeto al array
                }
            }

            mysqli_stmt_close($stmt);
            return $paises; // Devuelve el array de países

        } catch (mysqli_sql_exception $e) {
            error_log("Error en PaisDAO::getPaises(): " . $e->getMessage());
            return null;
        }
    }

}