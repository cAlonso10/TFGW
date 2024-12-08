<?php
namespace App\Services; 

use App\Models\Categoria; 
use Exception;

use Illuminate\Database\Capsule\Manager as DB;

class CategoriaService {
    public function createCategoria($data) {
        try {

            $categoria = new Categoria();
            $categoria->nombre = $data["nombre"];
            $categoria->save();

            return ["success" => true, "message" => "Categoria creada correctamente.", "categoria" => $categoria];
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al crear la categoria: " . $e->getMessage()];
        }
    }

    public function getCategorias() {
        try {
            $categorias = Categoria::all();
            return $categorias;
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al obtener las categorias: " . $e->getMessage()];
        }
    }

    public function getCategoriaById($id) {
        try {
            $categoria = Categoria::find($id);
            if ($categoria) {
                return ["success" => true, "categoria" => $categoria];
            } else {
                return ["success" => false, "message" => "Categoria no encontrada"];
            }
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al obtener la categoria: " . $e->getMessage()];
        }
    }

    public function deleteCategoria($id) {
        try {
            $categoria = Categoria::find($id);

            if ($categoria) {
                $categoria->delete(); 
                return ["success" => true, "message" => "Categoria {$id} eliminada correctamente."];
            } else {
                return ["success" => false, "message" => "Categoria {$id} no encontrada."];
            }
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al eliminar la categoria: " . $e->getMessage()];
        }
    }

    public function updateCategoria($id, $data) {
        try {
            $categoria = Categoria::find($id);

            if ($categoria) {
                
                if (!empty($data["nombre"])) {
                    $categoria->nombre = $data["nombre"];
                }

                $categoria->save();

                return ["success" => true, "message" => "Categoria $id actualizada correctamente.", "categoria" => $categoria];
            } else {
                return ["success" => false, "message" => "Categoria $id no encontrada."];
            }
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al actualizar la categoria: " . $e->getMessage()];
        }
    }

    public function getTotalCategorias(){
        try {
            $totalCategorias = Categoria::count();
            return ["success" => true, "total" => $totalCategorias];
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al contar los categoria: " . $e->getMessage()];
        }
    }
}





