<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\DBController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OcorrenciaController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\CodigoController;
use App\Http\Controllers\ComentarioController;
Route::prefix('usuario')
    ->name('usuario.')
    ->controller(UsuarioController::class)
    ->group(function () {
        Route::post('/cadastrar', 'store')->withoutMiddleware('auth:api')->name('cadastrar');
        Route::post('/login', 'login')->withoutMiddleware('auth:api')->name('login');
        Route::post('/checkcampo','check')->withoutMiddleware('auth:api')->name('check');
        Route::put('/alterar', 'updateSenha')->withoutMiddleware('auth:api')->name('alterarSenha');

        Route::middleware('auth:api')->group(function () {
            Route::get('/buscar', 'buscarUsuario')->name('buscar');
            Route::put('/update', 'updateUsuario')->name('update');
            Route::put('/deletar', 'delete')->name('deletar');
            Route::post('/upload', 'upload')->name('upload');
        });
    });

Route::prefix('ocorrencia')
    ->name('ocorrencia.')
    ->controller(OcorrenciaController::class)
    ->middleware('auth:api')
    ->group(function () {
        Route::get('/listar', 'index')->name('listar');
        Route::post('/registrar', 'store')->name('registrar');
        Route::get('/getall', 'allOcorrencias')->name('getall');
    });

Route::prefix('codigo')
    ->name('codigo.')
    ->controller(EmailController::class)
    ->group(function () {
        Route::post('/sendEmail', 'sendCodeEmail')->name('email');
        Route::post('/sendSms', 'sendCodeSms')->name('sms');
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

Route::prefix('comentario')
    ->name('notificacao')
    ->controller(ComentarioController::class)->middleware('auth:api')
    ->group(function (){
        Route::get('/comentarios/{idOcorrencia}', 'getByOcorrencia');
        Route::post('/comentarios', 'store');
});