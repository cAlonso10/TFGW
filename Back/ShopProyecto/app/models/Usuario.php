<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $table = "usuarios"; 

    protected $fillable = ["nombre", "email", "password", "tipo"];

    public $timestamps = true;

    public function carrito()
    {
        return $this->hasOne(Carrito::class);
    }

    public function productos()
    {
        return $this->hasMany(Producto::class, "vendedor_id");
    }


}
