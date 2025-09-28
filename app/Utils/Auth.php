<?php
class Auth {
    public static function startSession() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    public static function check() {
        self::startSession();
        return isset($_SESSION['user_id']);
    }

    public static function user() {
        self::startSession();
        return $_SESSION['user'] ?? null;
    }

    public static function isAdmin() {
        self::startSession();
        return (self::check() && $_SESSION['role'] === 'Administrador');
    }

    public static function login($user) {
        self::startSession();
        $_SESSION['user_id'] = $user->getIdUsuario();
        $_SESSION['role'] = $user->getTipo(); // "Admin" o "Usuario"
        $_SESSION['user'] = [
            'id' => $user->getIdUsuario(),
            'correo' => $user->getCorreo(),
            'nombre' => $user->getNombre(),
            'role' => $user->getTipo()
        ];
    }

    public static function logout() {
        self::startSession();
        session_destroy();
    }
}
