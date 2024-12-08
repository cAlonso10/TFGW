<?php
namespace App\Services; //

use App\Models\Usuario; 
use Exception;

use Illuminate\Database\Capsule\Manager as DB;

class UsuarioService {
    public function createUsuario($data) {
        try {

            $usuario = new Usuario();
            $usuario->nombre = $data["nombre"];
            $usuario->email = $data["email"];
            $usuario->password = password_hash($data["password"], PASSWORD_BCRYPT); 
            $usuario->tipo = $data["tipo"] ?? "cliente";
            $usuario->save();

            return ["success" => true, "message" => "Usuario creado correctamente.", "usuario" => $usuario];
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al crear el usuario: " . $e->getMessage()];
        }
    }

    public function getUsuarios() {
        try {
            $usuarios = Usuario::all();
            return $usuarios;
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al obtener los usuarios: " . $e->getMessage()];
        }
    }

    public function getUsuarioById($id) {
        try {
            $usuario = Usuario::find($id);
            if ($usuario) {
                return ["success" => true, "usuario" => $usuario];
            } else {
                return ["success" => false, "message" => "Usuario no encontrado"];
            }
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al obtener los usuarios: " . $e->getMessage()];
        }
    }

    public function deleteUsuario($id) {
        try {
            $usuario = Usuario::find($id);

            if ($usuario) {
                $usuario->delete(); 
                return ["success" => true, "message" => "Usuario {$id} eliminado correctamente."];
            } else {
                return ["success" => false, "message" => "Usuario {$id} no encontrado."];
            }
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al eliminar el usuario: " . $e->getMessage()];
        }
    }

    public function updateUsuario($id, $data) {
        try {
            $usuario = Usuario::find($id);

            if ($usuario) {
                
                if (!empty($data["nombre"])) {
                    $usuario->nombre = $data["nombre"];
                }

                if (!empty($data["email"])) {
                    $usuario->email = $data["email"];
                }
                
                if (!empty($data["password"])) {
                    $usuario->password = password_hash($data["password"], PASSWORD_BCRYPT);
                }

                $usuario->tipo = $data["tipo"] ?? $usuario->tipo;
                
                $usuario->save();

                return ["success" => true, "message" => "Usuario $id actualizado correctamente.", "usuario" => $usuario];
            } else {
                return ["success" => false, "message" => "Usuario $id no encontrado."];
            }
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al actualizar el usuario: " . $e->getMessage()];
        }
    }

    public function getTotalUsuarios() {
        try {
            $totalUsuarios = Usuario::count();
            return ["success" => true, "total" => $totalUsuarios];
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al contar los usuarios: " . $e->getMessage()];
        }
    }
    
}