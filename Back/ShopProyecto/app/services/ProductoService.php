<?php
namespace App\Services; 

use App\Models\Producto; 
use Exception;

use Illuminate\Database\Capsule\Manager as DB;

class ProductoService {
    public function createProducto($data) {
        try {
            // Ahora intentar crear el usuario
            $producto = new Producto();
            $producto->nombre = $data["nombre"];
            $producto->precio = $data["precio"];
            $producto->descripcion = $data["descripcion"];
            $producto->categoria_id = $data["categoria_id"];
            $producto->vendedor_id = $data["vendedor_id"];
            $producto->save();

            return ["success" => true, "message" => "Producto creado correctamente.", "producto" => $producto];
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al crear el producto: " . $e->getMessage()];
        }
    }

    public function getProductos() {
        try {
            $productos = Producto::with("categoria","vendedor","imagenes")->get();
            return $productos;
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al obtener los productos: " . $e->getMessage()];
        }
    }

    public function getProductoById($id) {
        try {
            $producto = Producto::with("imagenes")->find($id);
            if ($producto) {
                return ["success" => true, "producto" => $producto];
            } else {
                return ["success" => false, "message" => "Producto no encontrado"];
            }
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al obtener el producto: " . $e->getMessage()];
        }
    }

    public function getProductosByVendedor($userId) {
        try {
            $productos = Producto::where("vendedor_id", $userId)->with("imagenes", "categoria")->get();
            return $productos;
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al obtener los productos del vendedor: " . $e->getMessage()];
        }
    }

    public function getProductosByCategoria($categoriaId) {
        try {
            $productos = Producto::where("categoria_id", $categoriaId)->with("imagenes")->get();
            return $productos;
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al obtener los productos de la categoria: " . $e->getMessage()];
        }
    }

    public function searchProductosByName($query) {
        try {
            $productos = Producto::where("nombre", "LIKE", "%" . $query . "%")
                ->with("imagenes")
                ->get();
            return $productos;
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al buscar los productos: " . $e->getMessage()];
        }
    }
    

    public function deleteProducto($id) {
        try {
            $producto = Producto::find($id);

            if ($producto) {
                $producto->delete();
                return ["success" => true, "message" => "Producto {$id} eliminado correctamente."];
            } else {
                return ["success" => false, "message" => "Producto {$id} no encontrado."];
            }
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al eliminar la producto: " . $e->getMessage()];
        }
    }

    public function updateProducto($id, $data) {
        try {
            $producto = Producto::find($id);
    
            if ($producto) {
                if (!empty($data["nombre"])) {
                    $producto->nombre = $data["nombre"];
                }
    
                if (!empty($data["precio"])) {
                    $producto->precio = $data["precio"];
                }
    
                if (!empty($data["descripcion"])) {
                    $producto->descripcion = $data["descripcion"];
                }
    
                if (!empty($data["categoria_id"])) {
                    $producto->categoria_id = $data["categoria_id"];
                }
    
                $producto->save();
    
                return ["success" => true, "message" => "Producto $id actualizado correctamente.", "producto" => $producto];
            } else {
                return ["success" => false, "message" => "Producto $id no encontrado."];
            }
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al actualizar el producto: " . $e->getMessage()];
        }
    }
    

    public function getTotalProductos(){
        try {
            $totalProductos = Producto::count();
            return ["success" => true, "total" => $totalProductos];
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al contar los productos: " . $e->getMessage()];
        }
    }
}





