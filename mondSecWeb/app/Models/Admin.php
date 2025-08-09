<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Authenticatable

{
    use HasFactory;

    public $timestamps = true;
    protected $primaryKey = 'id';
    protected $table = 'tbAdmin';

    protected $fillable = [
        'nome',
        'email',
        'senha',
        'nivelAdmin',
    ];

    protected $hidden = [
        'senha',
    ];

    protected $casts = [
        'nome' => 'string',
        'email' => 'string',
        'nivelAdmin' => 'string',
    ];

     public function getAuthPassword()
    {
        return $this->senha;
    }
}
