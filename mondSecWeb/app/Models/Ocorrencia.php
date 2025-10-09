<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
        'tipo',
        'data',
        'idUsuario',
    ];
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'idUsuario', 'id');
    }



}
