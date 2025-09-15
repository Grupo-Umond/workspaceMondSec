<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RespostaComentario extends Model
{
    use HasFactory;

    protected $table = 'tbRespostaComentario';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'mensagem',
        'data',
        'idPai',
    ];
}
