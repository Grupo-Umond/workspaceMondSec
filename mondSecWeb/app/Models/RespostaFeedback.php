<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RespostaFeedback extends Model
{
    use HasFactory;

    protected $table = 'tbRespostaFeedback';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'mensagem',
        'data',
        'idPai',
    ];
}
