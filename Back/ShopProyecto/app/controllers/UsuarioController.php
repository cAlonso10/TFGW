<?php
require_once __DIR__ . "/../services/UsuarioService.php";

use App\Services\UsuarioService;

class UsuarioController {
    private $usuarioService;
    private $log_file;

    public function __construct() {
        $this->usuarioService = new UsuarioService();
        $this->log_file = __DIR__ . "/../storage/logs/logsUsuario.txt";
    }

    public function createUsuario() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!empty($data["nombre"]) && !empty($data["email"]) && !empty($data["password"])) {
            $resultado = $this->usuarioService->createUsuario($data);

            if ($resultado["success"]) {
                http_response_code(201); 
                echo json_encode(["message" => $resultado["message"], "usuario" => $resultado["usuario"]]);

                $error_message = "[" . date("Y-m-d H:i:s") . "] Usuario creado: " . $resultado["usuario"];
                error_log($error_message . "\n", 3, $this->log_file);
            } else {
                http_response_code(400); 
                echo json_encode(["message" => $resultado["message"]]);

                $error_message = "[" . date("Y-m-d H:i:s") . "] Error en la creación del usuario: " . $resultado["message"];
                error_log($error_message . "\n", 3, $this->log_file);
            }
        } else {
            http_response_code(400); 
            echo json_encode(["message" => "Datos incompletos."]);

            $error_message = "[" . date("Y-m-d H:i:s") . "] Datos incompletos al crear usuario";
            error_log($error_message . "\n", 3, $this->log_file);
        }
    }

    public function listUsuarios() {
        $usuarios = $this->usuarioService->getUsuarios();
        echo json_encode($usuarios);
    }
    
    public function usuarioById($id) {
        $resultado = $this->usuarioService->getUsuarioById($id);

        if ($resultado["success"]) {
            echo json_encode($resultado["usuario"]);
        } else {
            http_response_code(404); 
            echo json_encode(["message" => $resultado["message"]]);

            $error_message = "[" . date("Y-m-d H:i:s") . "] Error al obtener usuario por id: " . $resultado["message"];
            error_log($error_message . "\n", 3, $this->log_file);
        }
    }

    public function deleteUsuario($id) {
        $resultado = $this->usuarioService->deleteUsuario($id);

        if ($resultado["success"]) {
            echo json_encode(["message" => $resultado["message"]]);

            $error_message = "[" . date("Y-m-d H:i:s") . "] Se ha borrado el usuario ". $id;
            error_log($error_message . "\n", 3, $this->log_file);
        } else {
            http_response_code(404); 
            echo json_encode(["message" => $resultado["message"]]);

            $error_message = "[" . date("Y-m-d H:i:s") . "] Se ha intentado borrar un usuario inexistente: ". $id;
            error_log($error_message . "\n", 3, $this->log_file);
        }
    }

    public function updateUsuario($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!empty($data)) {
            $resultado = $this->usuarioService->updateUsuario($id, $data);

            if ($resultado["success"]) {
                echo json_encode(["message" => $resultado["message"], "usuario" => $resultado["usuario"]]);

                $error_message = "[" . date("Y-m-d H:i:s") . "] Se ha actualizado el usuario: ". $resultado["categoria"];
                error_log($error_message . "\n", 3, $this->log_file);
            } else {
                http_response_code(404); 
                echo json_encode(["message" => $resultado["message"]]);

                $error_message = "[" . date("Y-m-d H:i:s") . "] Error al actualizar usuario: ". $resultado["message"];
                error_log($error_message . "\n", 3, $this->log_file);
            }
        } else {
            http_response_code(400); 
            echo json_encode(["message" => "Datos incompletos."]);

            $error_message = "[" . date("Y-m-d H:i:s") . "] Datos incompletos al actualizar usuario";
            error_log($error_message . "\n", 3, $this->log_file);
        }
    }

    public function totalUsuarios() {
        $resultado = $this->usuarioService->getTotalUsuarios();

        if ($resultado["success"]) {
            echo json_encode(["totalUsuarios" => $resultado["total"]]);
        } else {
            http_response_code(500); 
            echo json_encode(["message" => $resultado["message"]]);
            $error_message = "[" . date("Y-m-d H:i:s") . "] Error al obtener total de usuarios: " . $resultado["message"];
            error_log($error_message . "\n", 3, $this->log_file);
        }
    }
    
}