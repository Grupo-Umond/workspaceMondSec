<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\DBController;
use App\Http\Controllers\AuthController;
<<<<<<< HEAD
use App\Http\Controllers\OcorrenciaController;
=======
>>>>>>> c01043568131a18646d5d421cccb15b2bd7d3a14

Route::controller(UsuarioController::class)->group(function () {
    Route::post('/usuarios', 'store');            // criar usuário
    Route::get('/usuarios', 'index');            // listar todos
    Route::get('/usuarios/{id}', 'show');        // buscar por ID
    Route::put('/usuarios/{id}', 'update');      // atualizar
    Route::delete('/usuarios/{id}', 'delete');   // remover
<<<<<<< HEAD
});

Route::middleware('auth:api')->controller(OcorrenciaController::class)->group(function () {
    Route::get('/procurar', 'index');
    Route::post('/registrar', 'store');
});


Route::middleware('auth:api')->controller(AuthController::class)->group(function () {
    Route::get('/buscar', 'informationProfile');
});
Route::post('/login', [AuthController::class, 'login']);

=======
    Route::post('/usuarios/google', 'cadastrarViaGoogle');
});

Route::controller(AuthController::class)->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

});
>>>>>>> c01043568131a18646d5d421cccb15b2bd7d3a14
Route::controller(DBController::class)->group(function () {
    Route::get('/usuariosAsc', 'indexAsc');  
    Route::get('/usuariosDesc', 'indexDesc'); 
});

