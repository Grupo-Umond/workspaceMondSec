<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'tbUsuario';
    public $timestamps = false;

    protected $fillable = [
        'nome',
        'email',
        'telefone',
        'senha',
        'genero',
        'dataCadastro',
        'expoToken', 
    ];

    protected $hidden = [
        'senha',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'idUsuario', 'id');
    }

    public function ocorrencia()
    {
        return $this->hasMany(Ocorrencia::class, 'idUsuario', 'id'); // chave estrangeira
    }

}
