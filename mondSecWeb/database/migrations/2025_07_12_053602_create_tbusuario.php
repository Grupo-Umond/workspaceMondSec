<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tbUsuario', function (Blueprint $table) {
            $table->increments('idUsuario'); 
            $table->string('nomeUsuario');
            $table->string('generoUsuario'); 
            $table->string('emailUsuario')->unique(); 
            $table->string('senhaUsuario');
            $table->timestamp('dataCadastroUsuario')->useCurrent();
            $table->string('avatar')->nullable();
            $table->boolean('authGoogle')->default(false);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbUsuario');
    }
};
