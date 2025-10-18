<?php
class Connection {
    private static $instance = null;
    private $conn;

    private function __construct() {
        $config = require 'config.php';
        $env = $config['env'];
        $dbConfig = $config[$env];

        try {
            $this->conn = new mysqli(
                $dbConfig['DB_SERVER'],
                $dbConfig['DB_USER'],
                $dbConfig['DB_PASS'],
                $dbConfig['DB_NAME'],
                $dbConfig['DB_PORT']
            );

            // Charset para evitar problemas con acentos y caracteres especiales
            $this->conn->set_charset("utf8");

            if ($this->conn->connect_error) {
                throw new Exception("Connection failed: " . $this->conn->connect_error);
            }
        } catch (Exception $e) {
            error_log("Database connection error: " . $e->getMessage());
            throw $e;
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection() {
        if (!$this->conn || $this->conn->ping() === false) {
            $this->reconnect();
        }
        return $this->conn;
    }

    private function reconnect() {
        $config = require 'config.php';
        $env = $config['env'];
        $dbConfig = $config[$env];

        if ($this->conn) {
            $this->conn->close();
        }

        $this->conn = new mysqli(
            $dbConfig['DB_SERVER'],
            $dbConfig['DB_USER'],
            $dbConfig['DB_PASS'],
            $dbConfig['DB_NAME']
        );

        $this->conn->set_charset("utf8");
    }

    public function closeConnection() {
        if ($this->conn) {
            $this->conn->close();
            $this->conn = null;
        }
    }

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

    public function showConnectionInfo() {
        $info = $this->getConnectionInfo();
        if ($info) {
            echo "<h2>Información de la Conexión:</h2>";
            echo "DB Server: " . $info['server_info'] . "<br>";
            echo "Host Info: " . $info['host_info'] . "<br>";
            echo "Protocol Version: " . $info['protocol_version'] . "<br>";
        } else {
            echo "<h2>No hay conexión activa a la base de datos.</h2>";
        }
    }
}

// Uso:
$database = Connection::getInstance();
$conn = $database->getConnection();
//$database->showConnectionInfo();