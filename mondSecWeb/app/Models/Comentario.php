<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comentario extends Model
{
    use HasFactory;

    protected $table = 'tbComentario';
    public $timestamps = false;

    protected $fillable = [;
        'mensagem',
        'data',
    ];
        public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'idUsuario', 'id');
    }

    public function ocorrencia()
    {
        return $this->belongsTo(Ocorrencia::class, 'idOcorrencia', 'id');
    }
}


