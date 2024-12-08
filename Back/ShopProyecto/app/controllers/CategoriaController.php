<?php
require_once __DIR__ . "/../services/CategoriasService.php";


use App\Services\CategoriaService;

class CategoriaController
{
    private $categoriaService;
    private $log_file;

    public function __construct()
    {
        $this->categoriaService = new CategoriaService();
        $this->log_file = __DIR__ . "/../storage/logs/logsCategoria.txt";
    }

    public function createCategoria()
    {

        $data = json_decode(file_get_contents("php://input"), true);


        if (!empty($data["nombre"])) {

            $resultado = $this->categoriaService->createCategoria($data);


            if ($resultado["success"]) {
                http_response_code(201); 
                echo json_encode([
                    "message" => $resultado["message"],
                    "categoria" => [
                        "id" => $resultado["categoria"]->id,
                        "nombre" => $resultado["categoria"]->nombre,
                    ]
                ]);

                $error_message = "[" . date("Y-m-d H:i:s") . "] Categoria creada: " . $resultado["categoria"];
                error_log($error_message . "\n", 3, $this->log_file);
            } else {
                http_response_code(400); 
                echo json_encode(["message" => $resultado["message"]]);

                $error_message = "[" . date("Y-m-d H:i:s") . "] Error en la creación de la categoría: " . $resultado["message"];
                error_log($error_message . "\n", 3, $this->log_file);
            }
        } else {
            http_response_code(400); 
            echo json_encode(["message" => "Datos incompletos."]);

            $error_message = "[" . date("Y-m-d H:i:s") . "] Datos incompletos al crear categoria";
            error_log($error_message . "\n", 3, $this->log_file);
        }
    }

    public function listCategorias()
    {
        $categorias = $this->categoriaService->getCategorias();

        echo json_encode($categorias);
    }

    public function categoriaById($id)
    {
        $resultado = $this->categoriaService->getCategoriaById($id);

        if ($resultado["success"]) {
            echo json_encode($resultado["categoria"]);
        } else {
            http_response_code(404); 
            echo json_encode(["message" => $resultado["message"]]);

            $error_message = "[" . date("Y-m-d H:i:s") . "] Error al obtener categoria por id: " . $resultado["message"];
            error_log($error_message . "\n", 3, $this->log_file);
        }
    }

    public function deleteCategoria($id)
    {
        $resultado = $this->categoriaService->deleteCategoria($id);

        if ($resultado["success"]) {
            echo json_encode(["message" => $resultado["message"]]);

            $error_message = "[" . date("Y-m-d H:i:s") . "] Se ha borrado la categoria " . $id;
            error_log($error_message . "\n", 3, $this->log_file);
        } else {
            http_response_code(404); 
            echo json_encode(["message" => $resultado["message"]]);

            $error_message = "[" . date("Y-m-d H:i:s") . "] Se ha intentado borrar una categoria inexistente: " . $id;
            error_log($error_message . "\n", 3, $this->log_file);
        }
    }

    public function updateCategoria($id)
    {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!empty($data)) {
 
            $resultado = $this->categoriaService->updateCategoria($id, $data);

            if ($resultado["success"]) {
                echo json_encode(["message" => $resultado["message"], "categoria" => $resultado["categoria"]]);

                $error_message = "[" . date("Y-m-d H:i:s") . "] Se ha actualizado la categoria: " . $resultado["categoria"];
                error_log($error_message . "\n", 3, $this->log_file);
            } else {
                http_response_code(404);
                echo json_encode(["message" => $resultado["message"]]);

                $error_message = "[" . date("Y-m-d H:i:s") . "] Error al actualizar categoria: " . $resultado["message"];
                error_log($error_message . "\n", 3, $this->log_file);
            }
        } else {
            http_response_code(400); 
            echo json_encode(["message" => "Datos incompletos."]);

            $error_message = "[" . date("Y-m-d H:i:s") . "] Datos incompletos al actualizar categoria";
            error_log($error_message . "\n", 3, $this->log_file);
        }
    }

    public function totalCategorias()
    {
        $resultado = $this->categoriaService->getTotalCategorias();

        if ($resultado["success"]) {
            echo json_encode(["totalCategorias" => $resultado["total"]]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => $resultado["message"]]);
            $error_message = "[" . date("Y-m-d H:i:s") . "] Error al obtener total de categorias: " . $resultado["message"];
            //error_log($error_message . "\n", 3, $this->log_file);
        }
    }
}
