<?php

namespace App\Models;

use Iluminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

<<<<<<< HEAD
=======
class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
>>>>>>> c01043568131a18646d5d421cccb15b2bd7d3a14

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'tbUsuario';
    protected $primaryKey = 'idUsuario';
    public $timestamps = false;

    protected $fillable = [
        'nomeUsuario',
        'emailUsuario',
        'senhaUsuario',
        'generoUsuario',
        'dataCadastroUsuario',
    ];

    protected $hidden = [
        'senhaUsuario',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'idUsuario');
    }

}
