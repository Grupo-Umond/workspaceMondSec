
// routes/api.php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\DBController;
use App\Http\Controllers\AuthController;

Route::controller(UsuarioController::class)->group(function () {
    Route::post('/usuarios', 'store');            // criar usuário
    Route::get('/usuarios', 'index');            // listar todos
    Route::get('/usuarios/{id}', 'show');        // buscar por ID
    Route::put('/usuarios/{id}', 'update');      // atualizar
    Route::delete('/usuarios/{id}', 'delete');   // remover
});

Route::controller(AuthController::class)->group(function () {
    Route::post('/login', 'login');
    Route::post('/buscar', 'informationProfile');

});
Route::controller(DBController::class)->group(function () {
    Route::get('/usuariosAsc', 'indexAsc');  
    Route::get('/usuariosDesc', 'indexDesc'); 
});
