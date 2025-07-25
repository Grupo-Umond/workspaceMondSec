<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\tbTipoOcorrencia;

class Ocorrencia extends Authenticatable

{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'tbOcorrencia';
    protected $primaryKey = 'idOcorrencia';
    public $timestamps = false;

    protected $fillable = [
        'tituloOcorrencia',
        'latitudeOcorrencia',
        'longitudeOcorrencia',
        'dataRegistradaOcorrencia',
        'idUsuario',
        'idTipo',
    ];

    public function tbTipoOcorrencia()
    {
        return $this->belongsTo(TipoOcorrencia::class, 'idTipo', 'idTipo');
    }

}
