<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
        return view('siteEmpresa.index');
    })->name('siteEmpresa.index');

Route::get('/adm', function () {
        return view('admin.layouts.app');
    })->name('siteAdm.login');

Route::prefix('siteAdm')
    ->name('adm.')
    ->controller(AdminController::class)
    ->group(function () {

        Route::get('/login', 'loginScreen')->name('login');
        Route::post('/login', 'login')->name('login.submit');
        Route::get('/cadastro', 'storeScreen')->name('store');
        Route::post('/cadastro', 'store')->name('store.submit');

        Route::middleware('admin.auth')->group(function () {
            Route::get('/home', 'homeScreen')->name('home');
            Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
            Route::get('/admlist', 'showAdmScreen')->name('showadm');
            Route::get('/userlist', 'showUserScreen')->name('showuser');

            Route::get('/adm/{id}', 'updateAdmScreen')->name('updateAdm');
            Route::put('/adm/{id}', 'updateAdm')->name('updateAdm.submit');

            Route::get('/user/{id}', 'updateUserScreen')->name('updateUser');
            Route::put('/user/{id}', 'updateUser')->name('updateUser.submit');

            Route::delete('/excluir/{id}', 'deleteAdm')->name('deleteAdm');
            Route::delete('/exclui/{id}', 'deleteUser')->name('deleteUser');

            Route::get('/logout', 'logout')->name('logout');
        });
    });
