<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

Route::get('/', function () {
        return view('siteAdm.index');
    })->name('siteAdm.index');

Route::prefix('siteEmpresa')->group( function () {
    return view('siteEmpresa.index');
});


Route::prefix('siteAdm')->group(function () {
    Route::get('/login', [AdminController::class, 'loginScreen'])->name('adm.login');
    Route::post('/login', [AdminController::class, 'login'])->name('adm.login.submit');
    Route::get('/cadastro', [AdminController::class, 'cadastroScreen'])->name('adm.cadastro');
    Route::post('/cadastro', [AdminController::class, 'store'])->name('adm.cadastro.submit');
    Route::get('/logout', [AdminController::class, 'logout'])->name('adm.logout');


    Route::middleware('admin.auth')->group(function () {
        Route::get('/home', function () {
            return view('siteAdm.home');
        })->name('siteAdm.home');
    });
});
