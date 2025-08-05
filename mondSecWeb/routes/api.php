<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\DBController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OcorrenciaController;
use App\Http\Controllers\NotificationController;


Route::post('/usuarios', [UsuarioController::class,'store']); 
Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:api')->controller(UsuarioController::class)->group(function() {
    Route::get('/usuarios', 'index');            
    Route::get('/usuarios/{id}', 'show');        
    Route::post('/updateSenha','updateSenha');
    Route::delete('/usuarios/{id}', 'delete');

});

Route::middleware('auth:api')->controller(OcorrenciaController::class)->group(function () {
    Route::get('/procurar', 'index');
    Route::post('/registrar', 'store');
});


Route::middleware('auth:api')->controller(AuthController::class)->group(function () {
    Route::get('/buscar', 'informationProfile');
    Route::post('/requestVerification','sendCode');
    Route::post('/verifyCode','verifyCode');


});

Route::middleware('auth:api')->controller(NotificationController::class)->group(function () {
    Route::post('/envNot', 'enviarNotificacao');
    Route::post('/tokenPush', 'salvar');

});


