<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

Route::get('/', function () {
        return view('siteEmpresa.index');
    })->name('siteEmpresa.index');

Route::get('/adm', function () {
        return view('siteAdm.login');
    })->name('siteAdm.login');

Route::prefix('siteAdm')
    ->name('adm.')
    ->controller(AdminController::class)
    ->group(function () {

        Route::get('/login', 'loginScreen')->name('login');
        Route::post('/login', 'login')->name('login.submit');
        Route::get('/cadastro', 'cadastroScreen')->name('cadastro');
        Route::post('/cadastro', 'store')->name('cadastro.submit');

        Route::middleware('admin.auth')->group(function () {
            Route::get('/home', 'homeScreen')->name('home');

            Route::get('/vizualisar', 'vizualisarAdmsScreen')->name('vizuAdms');
            Route::post('/vizualisar', 'vizualisarUsersScreen')->name('vizuUsers');

            Route::get('/alterar/{id}', 'alterarAdmScreen')->name('alterarAdm');
            Route::put('/alterar/{id}', 'updateAdm')->name('alterarAdm.submit');

            Route::delete('/excluir/{id}', 'deleteAdm')->name('deletarAdm');

            Route::get('/logout', 'logout')->name('logout');
        });
    });
