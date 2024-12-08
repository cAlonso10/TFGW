<?php
namespace App\Middlewares;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class AuthMiddleware {

    private $secret_key = "shopTFGKey";

    public static function checkAuth() {

        $headers = apache_request_headers();

        if (isset($headers["Authorization"])) {
            $token = str_replace("Bearer ", "", $headers["Authorization"]);
            
            try {
                $decoded = JWT::decode($token, new Key("shopTFGKey", "HS256"));
                return $decoded; 
            } catch (Exception $e) {
                error_log("Error al decodificar el token: " . $e->getMessage());
                http_response_code(401); 
                echo json_encode(["message" => "Token invalido o expirado."]);
                exit();
            }
        } else {
            http_response_code(401); 
            echo json_encode(["message" => "Token no proporcionado."]);
            exit();
        }
    }

    public static function checkRole($roles) {
        $user = self::checkAuth();
    
        if (!is_array($roles)) {
            $roles = [$roles];
        }
    
        if (!in_array($user->tipo, $roles)) {
            http_response_code(403);
            echo json_encode(["message" => "No tienes permiso para acceder a esta ruta."]);
            exit();
        }
    }

    public function verifyToken()
    {
        $headers = getallheaders();
        $authHeader = $headers["Authorization"] ?? "";

        if (!$authHeader || !preg_match("/Bearer\s(\S+)/", $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode(["message" => "Token no proporcionado o inválido"]);
            exit;
        }

        $jwt = $matches[1];

        try {
            $decoded = JWT::decode($jwt, new Key($this->secret_key, "HS256"));
            return (array) $decoded;
        } catch (\Exception $e) {
            error_log("Error al decodificar el token: " . $e->getMessage());
            http_response_code(401);
            echo json_encode(["message" => "Token inválido o expirado"]);
            exit;
        }
    }
}

?>