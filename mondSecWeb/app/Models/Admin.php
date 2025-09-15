<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Authenticatable

{
    use HasFactory;

    public $timestamps = true;
    protected $table = 'tbAdmin';

    protected $fillable = [
        'nome',
        'email',
        'telefone',
        'senha',
        'nivelAdmin',
    ];

    protected $hidden = [
        'senha',
    ];

     public function getAuthPassword()
    {
        return $this->senha;
    }
}
