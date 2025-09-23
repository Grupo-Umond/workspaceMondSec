<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TipoOcorrencia extends Model
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $table = 'tbTipoOcorrencia';
    protected $primaryKey = 'id';
    
    public $timestamps = true;

    protected $fillable = [
        'categoria',
        'descricao',
    ];

    public function ocorrencia()
    {
        return $this->hasMany(Ocorrencia::class, 'idTipoOcorrencia', 'id'); 
    }
}


