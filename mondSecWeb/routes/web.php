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
            Route::get('/adm/chart-admin', [DashboardController::class, 'viewAdmins'])->name('chart.admin');
            Route::get('/usuario/chart-usuario', [DashboardCOntroller::class, 'viewUsuarios'])->name('chart.usuario');
            Route::get('/usuario/chart-ocorrencia', [DashboardCOntroller::class, 'viewOcorrencias'])->name('chart.ocorrencia');

            // Admins
            Route::get('/admins', 'showAdmScreen')->name('admins.index');
            Route::get('/admins/{id}', 'updateAdmScreen')->name('admins.edit');
            Route::put('/admins/{id}', 'updateAdm')->name('admins.update');
            Route::delete('/admins/{id}', 'deleteAdm')->name('admins.destroy');

            //Contato
            Route::post('/contato', [EmailController::class, 'enviar'])->name('email.enviar');
            
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


