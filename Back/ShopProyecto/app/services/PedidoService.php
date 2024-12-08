<?php

namespace App\Services;

use App\Models\Pedido;
use App\Models\Carrito;
use Exception;

class PedidoService
{
    public function createOrder($userId,$status, $direccion) {
        try {
            if (empty($direccion)) {
                return ["success" => false, "message" => "La dirección es obligatoria"];
            }
    
            $carrito = Carrito::where("usuario_id", $userId)->with("productos")->first();
    
            if (!$carrito || $carrito->productos->isEmpty()) {
                return ["success" => false, "message" => "El carrito está vacío o no existe"];
            }
    
            $totalAmount = $carrito->productos->reduce(function ($total, $producto) {
                return $total + ($producto->pivot->cantidad * $producto->precio);
            }, 0);
    
            $pedido = Pedido::create([
                "usuario_id" => $userId,
                "amount" => $totalAmount,
                "status" => $status,
                "direccion" => $direccion,
            ]);
    
            foreach ($carrito->productos as $producto) {
                $pedido->productos()->attach($producto->id, [
                    "quantity" => $producto->pivot->cantidad,
                    "price" => $producto->precio,
                ]);
            }
            error_log("Pedido creado: " . print_r($pedido, true));
            $carrito->productos()->detach();
    
            return ["success" => true, "message" => "Pedido creado con éxito", "pedido" => $pedido];
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al crear el pedido: " . $e->getMessage()];
        }
    }
    

    public function getTotalPedidos(){
        try {
            $totalPedidos = Pedido::count();
            return ["success" => true, "total" => $totalPedidos];
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al contar los pedidos: " . $e->getMessage()];
        }
    }

    public function countPedidosByStatus($status){
        try {
            $totalPedidos = Pedido::where("status", $status)->count();
            return ["success" => true, "total" => $totalPedidos];
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al contar los pedidos: " . $e->getMessage()];
        }
    }

    public function listPedidos()
    {
        try {
            $pedidos = Pedido::with("usuario")->get();
            return ["success" => true, "data" => $pedidos];
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al obtener los pedidos: " . $e->getMessage()];
        }
    }

    public function getPedidoById($id)
    {
        try {
            $pedido = Pedido::with("usuario")->find($id);

            if (!$pedido) {
                return ["success" => false, "message" => "Pedido no encontrado"];
            }

            return ["success" => true, "data" => $pedido];
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al obtener el pedido: " . $e->getMessage()];
        }
    }

    public function updatePedido($id, $data)
    {
        try {
            $pedido = Pedido::find($id);

            if (!$pedido) {
                return ["success" => false, "message" => "Pedido no encontrado"];
            }

            $pedido->status = $data["status"];
            $pedido->save();

            return ["success" => true, "message" => "Pedido actualizado correctamente"];
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al actualizar el pedido: " . $e->getMessage()];
        }
    }

    public function deletePedido($id)
    {
        try {
            $pedido = Pedido::find($id);

            if (!$pedido) {
                return ["success" => false, "message" => "Pedido no encontrado"];
            }

            $pedido->delete();

            return ["success" => true, "message" => "Pedido eliminado correctamente"];
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al eliminar el pedido: " . $e->getMessage()];
        }
    }
}
