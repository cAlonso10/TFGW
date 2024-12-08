<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $table = "productos"; 

    protected $fillable = ["nombre", "precio", "descripcion", "categoria_id", "vendedor_id", "imagen_url"];

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function imagenes()
    {
        return $this->hasMany(ProductoImagen::class, "producto_id");
    }

    public function vendedor()
    {
        return $this->belongsTo(Usuario::class, "vendedor_id");
    }


}
