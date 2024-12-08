<?php

require_once __DIR__ . "/../services/ProductoImagenService.php";
require_once __DIR__ . "/../middlewares/AuthMiddleware.php";

use App\Services\ProductoImagenService;
use App\Middlewares\AuthMiddleware;
use App\Models\Producto;
use App\Models\ProductoImagen;

class ProductoImagenController {
    private $productoImagenService;
    private $authMiddleware;
    private $log_file;

    public function __construct() {
        $this->productoImagenService = new ProductoImagenService();
        $this->authMiddleware = new AuthMiddleware();
        $this->log_file = __DIR__ . "/../storage/logs/logsImagenes.txt";
    }

    public function uploadImages($productoId) {
        $userData = $this->authMiddleware->verifyToken(); 
        $userId = $userData["id"];
        $userRole = $userData["tipo"];
    
        $producto = Producto::find($productoId);
    
        if (!$producto || ($producto->vendedor_id !== $userId && $userRole !== "administrador")) {
            http_response_code(403); 
            echo json_encode(["message" => "No tienes permiso para subir imágenes a este producto."]);
            return;
        }
    
        if (empty($_FILES["imagenes"])) {
            http_response_code(400); 
            echo json_encode(["message" => "No se enviaron imágenes para subir."]);
            return;
        }
    
        $imagenes = $_FILES["imagenes"];
        $resultados = $this->productoImagenService->addImages($productoId, $imagenes);
    
        if (!empty($resultados)) {
            echo json_encode(["message" => "Imágenes subidas correctamente.", "imagenes" => $resultados]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Error al subir las imágenes."]);
            $error_message = "[" . date("Y-m-d H:i:s") . "] Error al subir imágenes por el usuario $userId.";
            error_log($error_message . "\n", 3, $this->log_file);
        }
    }
    

    public function listImages($productoId) {
        $imagenes = $this->productoImagenService->getImages($productoId);

        if (!empty($imagenes)) {
            echo json_encode($imagenes);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "No se encontraron imágenes para este producto."]);
        }
    }

    public function deleteImage($imagenId) {
        $userData = $this->authMiddleware->verifyToken();
        $userId = $userData["id"];
        $userRole = $userData["tipo"];
    
        $imagen = ProductoImagen::find($imagenId);
    
        if (!$imagen) {
            http_response_code(404); 
            echo json_encode(["message" => "La imagen no existe."]);
            return;
        }
    
        $producto = Producto::find($imagen->producto_id);
    
        if (!$producto || ($producto->vendedor_id !== $userId && $userRole !== "administrador")) {
            http_response_code(403); 
            echo json_encode(["message" => "No tienes permiso para eliminar esta imagen."]);
            return;
        }
    
        $resultado = $this->productoImagenService->deleteImage($imagenId);
    
        if ($resultado) {
            echo json_encode(["message" => "Imagen eliminada correctamente."]);
            $log_message = "[" . date("Y-m-d H:i:s") . "] Imagen $imagenId eliminada por el usuario $userId.";
            error_log($log_message . "\n", 3, $this->log_file);
        } else {
            http_response_code(500); 
            echo json_encode(["message" => "Error al eliminar la imagen."]);
            $error_message = "[" . date("Y-m-d H:i:s") . "] Error al eliminar imagen $imagenId por el usuario $userId.";
            error_log($error_message . "\n", 3, $this->log_file);
        }
    }
    
}
