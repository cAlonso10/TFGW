<?php
require_once __DIR__ . "../../../vendor/autoload.php";

use Illuminate\Database\Capsule\Manager as Capsule;

class Database
{
    public static function initialize()
    {
        try {
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


        } catch (Exception $e) {
            echo("Error al conectar a la base de datos: " . $e->getMessage());
        }
    }
}
