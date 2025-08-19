<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\DBController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OcorrenciaController;
use App\Http\Controllers\NotificationController;


Route::post('/cadastrar', [UsuarioController::class,'store']); 
Route::post('/login', [UsuarioController::class, 'login']);


Route::middleware('auth:api')->controller(UsuarioController::class)->group(function() {
    Route::get('/buscar', 'informationProfile');
    Route::put('/update','updateUsuario');
    Route::put('/alterar','updateSenha');
    Route::delete('/deletar', 'delete');

});

Route::middleware('auth:api')->controller(OcorrenciaController::class)->group(function () {
    Route::get('/procurar', 'index');
    Route::post('/registrar', 'store');
});


Route::middleware('auth:api')->controller(CodigoController::class)->group(function () {
    Route::post('/sendCodeEmail','sendCodeEmail');
    Route::post('/verifyCode','verifyCode');
});

Route::middleware('auth:api')->controller(NotificationController::class)->group(function () {
    Route::post('/envNot', 'enviarNotificacao');
    Route::post('/tokenPush', 'salvar');

});


