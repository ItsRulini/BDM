<?php

    class Connection {
        private static $instance = null;
        private $conn;

        // Configuración de la base de datos
        private const DB_SERVER="localhost";
        private const DB_USER="root";
        private const DB_PASS="admin";
        private const DB_NAME="bdm";

        private function __construct() {
            try {
                $this->conn = new mysqli(
                    self::DB_SERVER, 
                    self::DB_USER, 
                    self::DB_PASS, 
                    self::DB_NAME
                );
                
                // Configurar el charset para evitar problemas de caracteres
                $this->conn->set_charset("utf8");
                
                if ($this->conn->connect_error) {
                    throw new Exception("Connection failed: " . $this->conn->connect_error);
                }
            } catch (Exception $e) {
                error_log("Database connection error: " . $e->getMessage());
                throw $e; // Re-lanzar la excepción para que la aplicación pueda manejarla
            }
        }

        public static function getInstance() {
            if (self::$instance == null) {
                self::$instance = new self();
            }
            return self::$instance;
        }

        public function getConnection() {
            // Verificar si la conexión sigue activa
            if (!$this->conn || $this->conn->ping() === false) {
                // Reconectar si es necesario
                $this->reconnect();
            }
            return $this->conn;
        }

        private function reconnect() {
            if ($this->conn) {
                $this->conn->close();
            }
            $this->conn = new mysqli(
                self::DB_SERVER, 
                self::DB_USER, 
                self::DB_PASS, 
                self::DB_NAME
            );
            $this->conn->set_charset("utf8");
        }

        public function closeConnection() {
            if ($this->conn) {
                $this->conn->close();
                $this->conn = null;
            }
        }

        // Método para obtener información de la conexión
        public function getConnectionInfo() {
            if ($this->conn) {
                return [
                    'server_info' => $this->conn->server_info,
                    'host_info' => $this->conn->host_info,
                    'protocol_version' => $this->conn->protocol_version
                ];
            }
            return null;
        }
    }


    // Obtener la instancia de la bd y conectarse
    $database = Connection::getInstance();
    $conn = $database->getConnection();
    // Mostrar info de la conexión
    $connectionInfo = $database->getConnectionInfo();
    if ($connectionInfo) {
        print_r("<h1>Conexión exitosa a la base de datos.</h1>");
        print_r(
            "<h2>Info de la conexión: </h2>" .
            "DB Server: " . $connectionInfo['server_info'] . "<br>
            Host Info: " . $connectionInfo['host_info'] . "<br>
            Protocol Version: " . $connectionInfo['protocol_version'] . "<br>");
    } else {
        error_log("<h1>No active database connection.</h1>");
    }
?>