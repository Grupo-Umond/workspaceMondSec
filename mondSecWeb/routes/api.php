<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\DBController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OcorrenciaController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\CodigoController;

Route::prefix('usuario')
    ->name('usuario.')
    ->controller(UsuarioController::class)
    ->group(function () {
        Route::post('/cadastrar', 'store')->withoutMiddleware('auth:api')->name('cadastrar');
        Route::post('/login', 'login')->withoutMiddleware('auth:api')->name('login');

        Route::middleware('auth:api')->group(function () {
            Route::get('/buscar', 'buscarUsuario')->name('buscar');
            Route::put('/update', 'updateUsuario')->name('update');
            Route::put('/alterar', 'updateSenha')->name('alterarSenha');
            Route::delete('/deletar', 'delete')->name('deletar');
        });
    });

Route::prefix('ocorrencia')
    ->name('ocorrencia.')
    ->controller(OcorrenciaController::class)
    ->middleware('auth:api')
    ->group(function () {
        Route::get('/procurar', 'index')->name('listar');
        Route::post('/registrar', 'store')->name('registrar');
    });

Route::prefix('codigo')
    ->name('codigo.')
    ->controller(CodigoController::class)
    ->middleware('auth:api')
    ->group(function () {
        Route::post('/sendEmail', 'sendCodeEmail')->name('enviar');
        Route::post('/sendSms', 'sendCodeSms')->name('verify');
        Route::post('/verify', 'verifyCode')->name('verificar');
    });

Route::prefix('notificacao')
    ->name('notificacao.')
    ->controller(NotificationController::class)
    ->middleware('auth:api')
    ->group(function () {
        Route::post('/enviar', 'enviarNotificacao')->name('enviar');
        Route::post('/token', 'salvar')->name('token');
    });
