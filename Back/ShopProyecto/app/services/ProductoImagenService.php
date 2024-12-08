<?php

namespace App\Services;

use App\Models\Producto;
use App\Models\ProductoImagen;
use Illuminate\Support\Facades\File;

class ProductoImagenService{
    private $uploadPath;

    public function __construct() {
        $this->uploadPath = __DIR__ . "/../../public/uploads/";

        if (!file_exists($this->uploadPath)) {
            mkdir($this->uploadPath, 0755, true);
        }
    }

    public function addImages($productoId, $imagenes){
    $producto = Producto::findOrFail($productoId);
    $paths = [];

    foreach ($imagenes["name"] as $key => $name) {
        $tmp_name = $imagenes["tmp_name"][$key];
        $error = $imagenes["error"][$key];
        $size = $imagenes["size"][$key];

        
        $maxSize = 5 * 1024 * 1024; 
        if ($size > $maxSize) {
            error_log("Archivo $name excede el tamaño máximo permitido.");
            continue; 
        }

        if ($error === UPLOAD_ERR_OK) {
            $fileName = uniqid() . "." . pathinfo($name, PATHINFO_EXTENSION);

            if (move_uploaded_file($tmp_name, $this->uploadPath . $fileName)) {
                ProductoImagen::create([
                    "producto_id" => $producto->id,
                    "url" => "http://localhost:9000/uploads/$fileName"
                ]);

                $paths[] = $fileName;
            }
        }
    }

    return $paths;
}



    public function deleteImage($imagenId)
    {
        $imagen = ProductoImagen::findOrFail($imagenId);

        $filePath = $this->uploadPath . "/" . basename($imagen->url);

        if (file_exists($filePath)) {
            unlink($filePath);
        }

        $imagen->delete();

        return true;
    }

    public function getImages($productoId)
    {
        return ProductoImagen::where("producto_id", $productoId)->get();
    }
}
