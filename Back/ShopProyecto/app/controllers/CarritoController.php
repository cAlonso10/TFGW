<?php
namespace App\Controllers;
require_once __DIR__ . "/../services/CarritoService.php";

use App\Services\CarritoService;

class CarritoController {
    private $carritoService;
    private $logFile;

    public function __construct() {
        $this->carritoService = new CarritoService();
        $this->logFile = __DIR__ . "/../storage/logs/logsCarrito.txt";
    }

    public function getCart($userId) {
        $carrito = $this->carritoService->getCart($userId);
    
        if ($carrito) {
            echo json_encode($carrito);
        } else {
            http_response_code(404); 
            echo json_encode(["message" => "Carrito no encontrado"]);
    
            $error_message = "[" . date("Y-m-d H:i:s") . "] Error al obtener el carrito del usuario: $userId";
            error_log($error_message . "\n", 3, $this->logFile);
        }
    }
    

    public function addProductToCart($userId, $productoId, $cantidad) {
        $data = json_decode(file_get_contents("php://input"), true);
        $cantidad = isset($data["cantidad"]) ? (int)$data["cantidad"] : 1;
    
        $result = $this->carritoService->addProductToCart($userId, $productoId, $cantidad);
    
        if ($result["success"]) {
            echo json_encode(["message" => $result["message"]]);
    
            $error_message = "[" . date("Y-m-d H:i:s") . "] Producto añadido al carrito del usuario: $userId, Producto ID: $productoId";
            error_log($error_message . "\n", 3, $this->logFile);
        } else {
            http_response_code(400);
            echo json_encode(["message" => $result["error"]]);
    
            $error_message = "[" . date("Y-m-d H:i:s") . "] Error al añadir producto al carrito: " . $result["error"];
            error_log($error_message . "\n", 3, $this->logFile);
        }
    }

    
    public function removeProductFromCart($userId, $productoId) {
        $result = $this->carritoService->removeProductFromCart($userId, $productoId);
    
        if (isset($result["error"])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => $result["error"]]);
        } else {
            echo json_encode(["success" => true, "message" => "Producto eliminado del carrito"]);
        }
    }
    
    public function clearCart($userId) {
        $result = $this->carritoService->clearCart($userId);
    
        if (isset($result["error"])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => $result["error"]]);
        } else {
            echo json_encode(["success" => true, "message" => "Carrito vaciado"]);
        }
    }
    

    public function createCart($userId) {
        $carrito = $this->carritoService->createCart($userId);
    
        if (isset($carrito["error"])) {
            http_response_code(500);
            echo json_encode(["message" => $carrito["error"]]);
        } else {
            echo json_encode($carrito);
        }
    }
    
    public function obtenerCantidadProductosCarrito($userId) {
        $result = $this->carritoService->obtenerCantidadProductosCarrito($userId);
    
        if ($result["success"]) {
            echo json_encode(["count" => $result["count"]]);
        } else {
            http_response_code(400); 
            echo json_encode(["message" => $result["error"]]);
        }
    }

    public function updateProductQuantity($userId, $productoId) {
        $data = json_decode(file_get_contents("php://input"), true);
        $cantidad = isset($data["cantidad"]) ? (int)$data["cantidad"] : 1;
    
        $result = $this->carritoService->updateProductQuantity($userId, $productoId, $cantidad);
    
        if ($result["success"]) {
            echo json_encode([
                "success" => true,
                "message" => $result["message"],
                "updatedProduct" => $result["updatedProduct"]
            ]);
        } else {
            http_response_code(400);
            echo json_encode(["message" => $result["error"]]);
        }
    }
    
    
    
}


