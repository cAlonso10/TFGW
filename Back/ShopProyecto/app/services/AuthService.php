<?php

namespace App\Services;

use App\Models\Usuario;
use \Firebase\JWT\JWT;

class AuthService
{
    private $secret_key = "shopTFGKey";

    
     
    public function authenticate(string $email, string $password){
    
        $usuario = Usuario::where("email", $email)->first();

        if ($usuario && password_verify($password, $usuario->password)) {
            $payload = [
                "id" => $usuario->id,
                "email" => $usuario->email,
                "tipo" => $usuario->tipo
            ];

            $jwt = JWT::encode($payload, $this->secret_key, "HS256");

            return [
                "token" => $jwt,
                "userId" => $usuario->id
            ];
        }        
    }

    public function register(string $nombre, string $email, string $password)
    {

        if (Usuario::where("email", $email)->exists()) {
            return ["success" => false, "message" => "El usuario ya existe."];
        }

        $usuario = new Usuario();
        $usuario->nombre = $nombre;
        $usuario->email = $email;
        $usuario->password = password_hash($password, PASSWORD_BCRYPT);
        $usuario->tipo = "cliente"; 

        if ($usuario->save()) {
            return ["success" => true, "message" => "Usuario registrado con éxito."];
        }

        return ["success" => false, "message" => "Error al registrar el usuario."];
    }
}
