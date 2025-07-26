<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\DBController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OcorrenciaController;

Route::controller(UsuarioController::class)->group(function () {
    Route::post('/usuarios', 'store');            // criar usuário
    Route::get('/usuarios', 'index');            // listar todos
    Route::get('/usuarios/{id}', 'show');        // buscar por ID
    Route::put('/usuarios/{id}', 'update');      // atualizar
    Route::delete('/usuarios/{id}', 'delete');   // remover
});

Route::middleware('auth:api')->controller(OcorrenciaController::class)->group(function () {
    Route::get('/procurar', 'index');
    Route::post('/registrar', 'store');
});


Route::middleware('auth:api')->controller(AuthController::class)->group(function () {
    Route::get('/buscar', 'informationProfile');
});
Route::post('/login', [AuthController::class, 'login']);

Route::controller(DBController::class)->group(function () {
    Route::get('/usuariosAsc', 'indexAsc');  
    Route::get('/usuariosDesc', 'indexDesc'); 
});

