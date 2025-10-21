<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ContatoController;

Route::get('/', function () {
    return view('siteEmpresa.index');
})->name('site.index');

Route::get('/adm', function () {
    return view('adm.auth.login');
})->name('site.adm');

Route::prefix('adm')
    ->name('adm.')
    ->controller(AdminController::class)
    ->group(function () {

        // Auth
        Route::get('/login', 'loginScreen')->name('auth.login');
        Route::post('/login', 'login')->name('auth.login.store');
        Route::get('/cadastro', 'storeScreen')->name('auth.register');
        Route::post('/cadastro', 'store')->name('auth.register.store');
        Route::get('/logout', 'logout')->name('auth.logout');

        Route::middleware('admin.auth')->group(function () {

            // Dashboard
            Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');

            // Admins
            Route::get('/admins', 'showAdmScreen')->name('admins.index');
            Route::get('/admins/{id}', 'updateAdmScreen')->name('admins.edit');
            Route::put('/admins/{id}', 'updateAdm')->name('admins.update');
            Route::delete('/admins/{id}', 'deleteAdm')->name('admins.destroy');

            // Users
            Route::get('/users', 'showUserScreen')->name('users.index');
            Route::get('/users/{id}', 'updateUserScreen')->name('users.edit');
            Route::put('/users/{id}', 'updateUser')->name('users.update');
            Route::delete('/users/{id}', 'deleteUser')->name('users.destroy');

            //Ocorrencia
            Route::get('/ocorrencias','showOcorrenciaScreen')->name('ocorrencia.index');
            Route::get('/ocorrencias/{id}', 'updateOcorrenciaScreen')->name('ocorrencia.edit');
            Route::put('/ocorrencias/{id}', 'updateOcorrencia')->name('ocorrencia.update');
            Route::delete('/ocorrencias/{id}', 'deleteOcorrencia')->name('ocorrencia.destroy');
        });
    });


    //faleconosco
    Route::get('/contato', function () {
    return view('contato'); // aqui é a view onde está seu formulário
    });

    Route::post('/contato', [ContatoController::class, 'enviar'])->name('contato.enviar');