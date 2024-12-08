<?php

namespace App\Services;

use App\Models\Carrito;
use Exception;

class CarritoService {
    
    
    public function getCart($userId) {
        try {
            $carrito = Carrito::where("usuario_id", $userId)->with("productos.imagenes")->first();
            return $carrito;
        } catch (Exception $e) {
            return ["error" => "Error al obtener el carrito: " . $e->getMessage()];
        }
    }

    public function addProductToCart($userId, $productoId, $cantidad = 1) {
        try {
            $carrito = Carrito::firstOrCreate(["usuario_id" => $userId]);
    
            $existingProduct = $carrito->productos()->where("producto_id", $productoId)->first();
    
            if ($existingProduct) {
                $newQuantity = $existingProduct->pivot->cantidad + $cantidad;
                $carrito->productos()->updateExistingPivot($productoId, ["cantidad" => $newQuantity]);
            } else {
                $carrito->productos()->attach($productoId, ["cantidad" => $cantidad]);
            }
    
            return ["success" => true, "message" => "Producto añadido al carrito"];
        } catch (Exception $e) {
            return ["success" => false, "error" => "Error al añadir el producto al carrito: " . $e->getMessage()];
        }
    }

    public function removeProductFromCart($userId, $productoId) {
        try {
            $carrito = Carrito::where("usuario_id", $userId)->first();

            if (!$carrito) {
                return ["message" => "Carrito no encontrado"];
            }

            $carrito->productos()->detach($productoId);
            return ["message" => "Producto eliminado del carrito"];
        } catch (Exception $e) {
            return ["error" => "Error al eliminar el producto del carrito: " . $e->getMessage()];
        }
    }

    public function clearCart($userId) {
        try {
            $carrito = Carrito::where("usuario_id", $userId)->first();

            if (!$carrito) {
                return ["message" => "Carrito no encontrado"];
            }

            $carrito->productos()->detach();
            return ["message" => "Carrito vaciado"];
        } catch (Exception $e) {
            return ["error" => "Error al vaciar el carrito: " . $e->getMessage()];
        }
    }
    
    public function createCart($userId) {
        try {
            $carrito = Carrito::create(["usuario_id" => $userId]);
            
            return $carrito;
        } catch (Exception $e) {
            return ["error" => "Error al crear el carrito: " . $e->getMessage()];
        }
    }

    public function obtenerCantidadProductosCarrito($userId) {
        try {
            $carrito = Carrito::where("usuario_id", $userId)->with("productos")->first();
            if (!$carrito) {
                return ["message" => "Carrito no encontrado", "count" => 0];
            }

            $totalProductos = $carrito->productos->sum("pivot.cantidad");
    
            return ["success" => true, "count" => $totalProductos];
        } catch (Exception $e) {
            return ["success" => false, "error" => "Error al obtener la cantidad de productos en el carrito: " . $e->getMessage()];
        }
    }

    public function updateProductQuantity($userId, $productoId, $cantidad) {
        try {
            $carrito = Carrito::where("usuario_id", $userId)->first();
    
            if (!$carrito) {
                return ["success" => false, "error" => "Carrito no encontrado"];
            }
    
            $productoEnCarrito = $carrito->productos()->where("producto_id", $productoId)->first();
    
            if (!$productoEnCarrito) {
                return ["success" => false, "error" => "Producto no encontrado en el carrito"];
            }
    
            if ($cantidad <= 0) {
                $carrito->productos()->detach($productoId);
                return [
                    "success" => true,
                    "message" => "Producto eliminado del carrito",
                    "updatedProduct" => null 
                ];
            }

            $carrito->productos()->updateExistingPivot($productoId, ["cantidad" => $cantidad]);
 
            $updatedProduct = $carrito->productos()->where("producto_id", $productoId)->with("imagenes")->first();
    
            return [
                "success" => true,
                "message" => "Cantidad del producto actualizada correctamente",
                "updatedProduct" => $updatedProduct
            ];
        } catch (Exception $e) {
            return ["success" => false, "error" => "Error al actualizar la cantidad del producto: " . $e->getMessage()];
        }
    }
    
    
}


