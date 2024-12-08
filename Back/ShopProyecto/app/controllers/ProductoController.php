<?php
require_once __DIR__ . "/../services/ProductoService.php";
require_once __DIR__ . "/../middlewares/AuthMiddleWare.php";

use App\Services\ProductoService;
use App\Middlewares\AuthMiddleware;
use App\Models\Producto;

class ProductoController {
    private $productoService;
    private $authMiddleware;
    private $log_file;

    public function __construct() {
        $this->productoService = new ProductoService();
        $this->authMiddleware = new AuthMiddleware();
        $this->log_file = __DIR__ . "/../storage/logs/logsProducto.txt";
    }

    public function createProducto() {
        
        $data = json_decode(file_get_contents("php://input"), true);

        
        if (!empty($data["nombre"])) {
            $resultado = $this->productoService->createProducto($data);
            if ($resultado["success"]) {
                http_response_code(201); 
                echo json_encode(["message" => $resultado["message"], "producto" => $resultado["producto"]]);

                $error_message = "[" . date("Y-m-d H:i:s") . "] Producto creado: " . $resultado["producto"];
                error_log($error_message . "\n", 3, $this->log_file);
            } else {
                http_response_code(400); 
                echo json_encode(["message" => $resultado["message"]]);

                $error_message = "[" . date("Y-m-d H:i:s") . "] Error en la creación del producto: " . $resultado["message"];
                error_log($error_message . "\n", 3, $this->log_file);
            }
        } else {
            http_response_code(400); 
            echo json_encode(["message" => "Datos incompletos."]);

            $error_message = "[" . date("Y-m-d H:i:s") . "] Datos incompletos al crear producto";
            error_log($error_message . "\n", 3, $this->log_file);
        }
    }


    public function listProductos() {
        $productos = $this->productoService->getProductos();
        echo json_encode($productos);
        
    }
    
    public function productoById($id) {
        $resultado = $this->productoService->getProductoById($id);

        if ($resultado["success"]) {
            echo json_encode($resultado["producto"]);
        } else {
            http_response_code(404); 
            echo json_encode(["message" => $resultado["message"]]);

            $error_message = "[" . date("Y-m-d H:i:s") . "] Error al obtener producto por id: " . $resultado["message"];
            error_log($error_message . "\n", 3, $this->log_file);
        }
    }

    public function productosByVendedor() {
        $userData = $this->authMiddleware->verifyToken(); 
        $userId = $userData["id"];

        $productos = $this->productoService->getProductosByVendedor($userId);
        echo json_encode($productos);
    }

    public function productosByCategoria($categoriaId) {
        $productos = $this->productoService->getProductosByCategoria($categoriaId);
        echo json_encode($productos);
    }

    public function searchProductos($query) {
        $productos = $this->productoService->searchProductosByName($query);
        echo json_encode($productos);
    }

    public function deleteProducto($id) {
        $resultado = $this->productoService->deleteProducto($id);

        if ($resultado["success"]) {
            echo json_encode(["message" => $resultado["message"]]);

            $error_message = "[" . date("Y-m-d H:i:s") . "] Se ha borrado el producto ". $id;
            error_log($error_message . "\n", 3, $this->log_file);
        } else {
            http_response_code(404); 
            echo json_encode(["message" => $resultado["message"]]);

            $error_message = "[" . date("Y-m-d H:i:s") . "] Se ha intentado borrar un producto inexistente: ". $id;
            error_log($error_message . "\n", 3, $this->log_file);
        }
    }

    public function updateProducto($id) {
        $userData = $this->authMiddleware->verifyToken(); 
        $userId = $userData["id"]; 
        $userRole = $userData["tipo"]; 
        
        $producto = Producto::findOrFail($id); 
    
        if ($producto->vendedor_id !== $userId && $userRole !== "administrador") {
            http_response_code(403);
            echo json_encode(["message" => "No tienes permiso para editar este producto."]);
            return;
        }

        $data = json_decode(file_get_contents("php://input"), true);
    
        if (!empty($data)) {
            $resultado = $this->productoService->updateProducto($id, $data);
    
            if ($resultado["success"]) {
                echo json_encode(["message" => $resultado["message"], "producto" => $resultado["producto"]]);
            } else {
                http_response_code(500); 
                echo json_encode(["message" => $resultado["message"]]);
            }
        } else {
            http_response_code(400); 
            echo json_encode(["message" => "Datos incompletos."]);
        }
    }
    

    public function totalProductos(){
        $resultado = $this->productoService->getTotalProductos();

        if ($resultado["success"]) {
            echo json_encode(["totalProductos" => $resultado["total"]]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => $resultado["message"]]);
            $error_message = "[" . date("Y-m-d H:i:s") . "] Error al obtener total de productos: " . $resultado["message"];
            //error_log($error_message . "\n", 3, $this->log_file);
        }
    }
}