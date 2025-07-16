<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Usuario extends Model
{
    use HasFactory;

    /**
     * Tabela e chave primária.
     * Ajuste "idUsuario" se o nome na migration for diferente.
     */
    protected $table = 'tbUsuario';
    protected $primaryKey = 'idUsuario';

    /**
     * Desativamos timestamps padrão, pois usamos "dataCadastroUsuario".
     */
    public $timestamps = false;

    /**
     * Campos que poderão ser preenchidos via mass‑assignment.
     */
    protected $fillable = [
        
        'nomeUsuario',
        'emailUsuario',
        'senhaUsuario',
        'generoUsuario',
        'avatar',
        'authGoogle',
        'dataCadastroUsuario',
    ];

    /**
     * Ocultamos a senha nas respostas JSON.
     */
    protected $hidden = [
        'senhaUsuario',
    ];
}
