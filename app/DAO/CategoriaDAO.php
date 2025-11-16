<?php
include_once '../Models/Categoria.php';

class CategoriaDAO {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getCategorias(): ?array {

        try {
            $query = "CALL sp_getCategorias()";
            $stmt = mysqli_prepare($this->conn, $query);

            if (!$stmt) {
                throw new Exception("Error al preparar la consulta: " . mysqli_error($this->conn));
            }

            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);

            $categorias = [];

            if ($result) {
                // Itera sobre cada fila del resultado
                while ($row = mysqli_fetch_assoc($result)) {
                    $categoria = new Categoria();
                    $categoria->setIdCategoria($row['IdCategoria']);
                    $categoria->setNombre($row['Nombre']);

                    // Suponiendo que el SP retorna una columna 'num_posts'
                    $numPosts = isset($row['num_posts']) ? (int)$row['num_posts'] : 0;

                    // Agrega como clave-valor: ['categoria' => Categoria, 'num_posts' => int]
                    $categorias[] = [
                        'categoria' => $categoria,
                        'num_posts' => $numPosts
                    ];
                }
            }

            mysqli_stmt_close($stmt);
            return $categorias;

        } catch (mysqli_sql_exception $e) {
            error_log("Error en CategoriaDAO::getCategorias(): " . $e->getMessage());
            return null;
        }
    }
    public function crearCategoria(Categoria $categoria): ?int {
        try {
            // Preparar el CALL con variable de salida
            $query = "CALL sp_crearCategoria(?, @p_id)";
            $stmt = mysqli_prepare($this->conn, $query);

            $nombre = $categoria->getNombre();

            if (!$stmt) {
                throw new Exception("Error al preparar la consulta: " . mysqli_error($this->conn));
            }

            // Vincular parámetros de entrada
            mysqli_stmt_bind_param($stmt, 's', $nombre);

            // Ejecutar el procedimiento
            if (!mysqli_stmt_execute($stmt)) {
                throw new Exception("Error al ejecutar el procedimiento: " . mysqli_stmt_error($stmt));
            }

            // Cerrar el statement antes de hacer la siguiente consulta
            mysqli_stmt_close($stmt);

            // Obtener el valor del parámetro de salida
            $result = $this->conn->query("SELECT @p_id AS id");
            if ($row = $result->fetch_assoc()) {
                $categoria->setIdCategoria($row['id']);
                return $categoria->getIdCategoria();
            }

            return null;
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
            return null;
        }
    }

    public function updateCategoria(Categoria $categoria): bool {
        try {
            // Preparar el CALL con variable de salida
            $query = "CALL sp_updateCategoria(?, ?)";
            $stmt = mysqli_prepare($this->conn, $query);

            $id = $categoria->getIdCategoria();
            $nombre = $categoria->getNombre();

            if (!$stmt) {
                throw new Exception("Error al preparar la consulta: " . mysqli_error($this->conn));
            }

            // Vincular parámetros de entrada
            mysqli_stmt_bind_param(
                $stmt, 'is', 
                $id,
                $nombre);

            // Ejecutar el procedimiento
            if (!mysqli_stmt_execute($stmt)) {
                throw new Exception("Error al ejecutar el procedimiento: " . mysqli_stmt_error($stmt));
            }

            // Cerrar el statement antes de hacer la siguiente consulta
            mysqli_stmt_close($stmt);

            return true;
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
            return false;
        }
    }

    public function getFiltros(): ?array {

        try {
            $query = "CALL sp_filtros_categorias()";
            $stmt = mysqli_prepare($this->conn, $query);

            if (!$stmt) {
                throw new Exception("Error al preparar la consulta: " . mysqli_error($this->conn));
            }

            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);

            $filtros = [];
            if ($result) {
                // Itera sobre cada fila del resultado
                while ($row = mysqli_fetch_assoc($result)) {
                    $categoria = new Categoria();
                    $categoria->setIdCategoria($row['IdCategoria']);
                    $categoria->setNombre($row['Nombre']);

                    $filtros[] = $categoria;
                }
            }

            mysqli_stmt_close($stmt);
            return $filtros;

        } catch (mysqli_sql_exception $e) {
            error_log("Error en CategoriaDAO::getFiltros(): " . $e->getMessage());
            return null;
        }
    }

}