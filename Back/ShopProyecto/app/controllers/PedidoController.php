<?php


require_once __DIR__ . "/../services/PedidoService.php";

use App\Models\Pedido;
use App\Services\PedidoService;

class PedidoController
{
    private $pedidoService;

    public function __construct()
    {
        $this->pedidoService = new PedidoService();
    }

    public function createOrder($userId)
    {

        $data = json_decode(file_get_contents("php://input"), true);
        error_log("Datos recibidos: " . print_r($data, true)); 
        $status = $data["status"] ?? "pendiente";
        $direccion = $data["direccion"];

        $result = $this->pedidoService->createOrder($userId, $status, $direccion);

        if ($result["success"]) {
            echo json_encode(["message" => $result["message"], "pedido" => $result["pedido"]]);
        } else {
            http_response_code(400);
            echo json_encode(["message" => $result["message"]]);
        }
    }

    public function totalPedidos(){
        $resultado = $this->pedidoService->getTotalPedidos();

        if ($resultado["success"]) {
            echo json_encode(["totalPedidos" => $resultado["total"]]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => $resultado["message"]]);
            $error_message = "[" . date("Y-m-d H:i:s") . "] Error al obtener total de pedidos: " . $resultado["message"];
            //error_log($error_message . "\n", 3, $this->log_file);
        }
    }

    public function totalPedidosPendientes(){
        $resultado = $this->pedidoService->countPedidosByStatus(Pedido::STATUS_PENDING);
        if ($resultado["success"]) {
            echo json_encode(["totalPedidosPendientes" => $resultado["total"]]);
        } else {
            http_response_code(500); 
            echo json_encode(["message" => $resultado["message"]]);
            $error_message = "[" . date("Y-m-d H:i:s") . "] Error al obtener total de pedidos: " . $resultado["message"];
            //error_log($error_message . "\n", 3, $this->log_file);
        }
    }

    public function getPedidos()
    {
        $resultado = $this->pedidoService->listPedidos();

        if ($resultado["success"]) {
            echo json_encode($resultado["data"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => $resultado["message"]]);
        }
    }

    public function getPedidoById($id)
    {
        $resultado = $this->pedidoService->getPedidoById($id);

        if ($resultado["success"]) {
            echo json_encode($resultado["data"]);
        } else {
            http_response_code(404);
            echo json_encode(["message" => $resultado["message"]]);
        }
    }

    public function updatePedido($id)
    {
        $data = json_decode(file_get_contents("php://input"), true);

        $resultado = $this->pedidoService->updatePedido($id, $data);

        if ($resultado["success"]) {
            echo json_encode(["message" => $resultado["message"]]);
        } else {
            http_response_code(404);
            echo json_encode(["message" => $resultado["message"]]);
        }
    }

    public function deletePedido($id)
    {
        $resultado = $this->pedidoService->deletePedido($id);

        if ($resultado["success"]) {
            echo json_encode(["message" => $resultado["message"]]);
        } else {
            http_response_code(404);
            echo json_encode(["message" => $resultado["message"]]);
        }
    }
}
