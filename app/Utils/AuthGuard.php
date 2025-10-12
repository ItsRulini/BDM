<?php
include_once 'Auth.php';

class AuthGuard {
    public static function requireLogin() {
        if (!Auth::check()) {
            header("Location: index.php?controller=home&action=login");
            exit();
        }
    }

    public static function requireAdmin() {
        if (!Auth::isAdmin()) {
            // Opción A: redirigir al login
            Auth::logout();
            header("Location: index.php?controller=home&action=login");
            exit();

            // Opción B: mostrar vista de error personalizada
            // require '../Views/errors/403.html';
            // exit();
        }
    }

    public static function requireUser() {
        if (!Auth::check() || Auth::user()['role'] !== 'Usuario') {
            Auth::logout();
            header("Location: index.php?controller=home&action=login");
            exit();
        }
    }
}
