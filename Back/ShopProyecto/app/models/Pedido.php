<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $table = "orders";

    protected $fillable = ["usuario_id", "amount", "status", "direccion"];

    const STATUS_PENDING = "pendiente";
    const STATUS_COMPLETED = "completado";
    const STATUS_CANCELED = "cancelado";

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, "usuario_id");
    }


    public function productos()
    {
        return $this->belongsToMany(Producto::class, "order_products", "order_id", "product_id")
            ->withPivot("quantity", "price")
            ->withTimestamps();
    }
}
