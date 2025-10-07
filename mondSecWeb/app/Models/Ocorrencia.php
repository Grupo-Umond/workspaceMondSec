<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\tbTipoOcorrencia;

class Ocorrencia extends Model

{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'tbOcorrencia';
    protected $primaryKey = 'idOcorrencia';
    public $timestamps = false;

    protected $fillable = [
        'titulo',
        'latitude',
        'longitude',
        'descricao',
        'categoria',
        'data',
        'idUsuario',
    ];
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'idUsuario', 'id');
    }



}
