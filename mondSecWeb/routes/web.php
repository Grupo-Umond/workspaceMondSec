<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ContatoController;

Route::get('/', function () {
    return view('siteEmpresa.index');
})->name('site.index');

Route::get('/adm', function () {
    return view('adm.auth.cadastro');
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
            Route::put('/admins/excluir/{id}', 'deleteAdm')->name('admins.destroy');

            //Contato
            Route::post('/contato', [EmailController::class, 'enviar'])->name('email.enviar');
            
            // Users
            Route::get('/users', 'showUserScreen')->name('users.index');
            Route::get('/users/{id}', 'updateUserScreen')->name('users.edit');
            Route::put('/users/{id}', 'updateUser')->name('users.update');
            Route::delete('/users/excluir/{id}', 'deleteUser')->name('users.destroy');

            //Ocorrencia
            Route::get('/ocorrencias','showOcorrenciaScreen')->name('ocorrencia.index');
            Route::get('/ocorrencias/{id}', 'updateOcorrenciaScreen')->name('ocorrencia.edit');
            Route::put('/ocorrencias/{id}', 'updateOcorrencia')->name('ocorrencia.update');
            Route::put('/ocorrencias/excluir/{id}', 'deleteOcorrencia')->name('ocorrencia.destroy');
            Route::get('/denuncias/ocorrencia','showDenunciaOcorrenciaScreen')->name('ocorrencia.denuncia');
            Route::get('/ocorrencias/selecionada/{id}','ocorrenciaSelecionada')->name('ocorrencia.selecionada');


            //Comentario
            Route::get('/cometarios', 'showComentarioScreen')->name('comentario.index');
            Route::put('/{id}','update')->name('comentario.update');
            Route::get('/comentario/{id}', 'show')->name('comentario.show');
            Route::put('/comentario/excluir/{id}', 'destroy')->name('comentario.destroy');
            Route::get('/comentario/selecionado/{id}','selecionado');
            Route::get('/denuncias/comentario','showDenunciaComentarioScreen')->name('comentario.denuncia');


        });
    });

