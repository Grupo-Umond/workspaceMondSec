<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tbUsuario', function (Blueprint $table) {
            $table->id(); 
            $table->string('expoToken')->nullable();
            $table->string('nome');
            $table->string('genero'); 
            $table->string('email')->unique(); 
            $table->string('telefone')->unique();
            $table->string('foto')->default('storage/fotos/default.png');
            $table->string('senha');
            $table->string('status')->default('ativo');
            $table->timestamp('data')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbUsuario');
    }
};
