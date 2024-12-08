<?php
require_once __DIR__ . "../../vendor/autoload.php"; 

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Eloquent\Model;


$capsule = new Capsule;

$capsule->addConnection([
    "driver"    => "mysql",
    "host"      => "127.0.0.1", 
    "database"  => "ShopDB",    
    "username"  => "root",      
    "password"  => "admin",    
    "charset"   => "utf8",
    "collation" => "utf8_unicode_ci",
    "prefix"    => "",
]);


$capsule->setAsGlobal();
$capsule->bootEloquent();

class Usuario extends Model
{
    protected $table = "usuarios"; 
    public $timestamps = true; 
    protected $fillable = ["nombre", "email", "password", "tipo"]; 
}

try {
    $usuarios = [
        ["nombre" => "Administrador", "email" => "admin@admin.com", "password" => password_hash("admin", PASSWORD_DEFAULT), "tipo" => "administrador"],
        ["nombre" => "Vendedor", "email" => "vendedor@vendedor.com", "password" => password_hash("vendedor", PASSWORD_DEFAULT), "tipo" => "vendedor"],
        ["nombre" => "Usuario", "email" => "usuario@usuario.com", "password" => password_hash("usuario", PASSWORD_DEFAULT), "tipo" => "cliente"],
    ];

    foreach ($usuarios as $datosUsuario) {
        Usuario::create($datosUsuario);
        echo "Usuario creado exitosamente: " . $datosUsuario["email"] . PHP_EOL;
    }
} catch (Exception $e) {
    echo "Error al crear los usuarios: " . $e->getMessage() . PHP_EOL;
}
