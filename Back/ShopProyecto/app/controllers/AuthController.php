<?php

use App\Services\AuthService;

class AuthController
{
    private $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    public function login()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $email = $data["email"] ?? null;
        $password = $data["password"] ?? null;

        if (!$email || !$password) {
            http_response_code(400);
            echo json_encode(["message" => "Email y contraseña son obligatorios"]);
            return;
        }

        $authResult = $this->authService->authenticate($email, $password);

        if ($authResult) {
            echo json_encode(["token" => $authResult["token"], "userId" => $authResult["userId"]]);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Credenciales incorrectas"]);
        }
    }

    public function register()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $nombre = $data["nombre"] ?? null;
        $email = $data["email"] ?? null;
        $password = $data["password"] ?? null;

        if (!$nombre || !$email || !$password) {
            http_response_code(400);
            echo json_encode(["message" => "Todos los campos son obligatorios"]);
            return;
        }

        $registerResult = $this->authService->register($nombre, $email, $password);

        if ($registerResult["success"]) {
            http_response_code(201);
            echo json_encode(["message" => $registerResult["message"]]);
        } else {
            http_response_code(400);
            echo json_encode(["message" => $registerResult["message"]]);
        }
    }
}
