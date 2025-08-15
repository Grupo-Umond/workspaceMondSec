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
    protected $primaryKey = 'idUsuario';
    public $timestamps = false;

    protected $fillable = [
        'nomeUsuario',
        'emailUsuario',
        'telefoneUsuario',
        'senhaUsuario',
        'generoUsuario',
        'dataCadastroUsuario',
        'expo_token', 
    ];

    protected $hidden = [
        'senhaUsuario',
    ];
}
