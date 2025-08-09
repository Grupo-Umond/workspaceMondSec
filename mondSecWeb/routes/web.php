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
    Route::get('/home', [AdminController::class, 'homeScreen'])->name('adm.home');
    Route::get('/cadastro', [AdminController::class, 'cadastroScreen'])->name('adm.cadastro');
    Route::post('/cadastro', [AdminController::class, 'store'])->name('adm.cadastro.submit');
    Route::get('/vizualisar', [AdminController::class, 'vizualisarAdmsScreen'])->name('adm.vizuAdms');
    Route::post('/vizualisar', [AdminController::class, 'vizualisarUsersScreen'])->name('adm.vizuUsers');
    Route::get('/alterar/{id}', [AdminController::class, 'alterarAdmScreen'])->name('adm.alterarAdm');
    Route::put('/alterar/{id}', [AdminController::class, 'updateAdm'])->name('adm.alterarAdm.submit');
    Route::delete('/excluir/{id}', [AdminController::class, 'deleteAdm'])->name('adm.deletarAdm');
    Route::get('/logout', [AdminController::class, 'logout'])->name('adm.logout');



});
