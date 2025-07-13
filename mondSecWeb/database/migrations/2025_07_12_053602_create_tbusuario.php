<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tbUsuario', function (Blueprint $table) {
            $table->increments('idUsuario'); // ID autoincremental
            $table->string('nomeUsuario'); // nome do usuário
            $table->string('generoUsuario'); // gênero
            $table->string('emailUsuario')->unique(); // e-mail único
            $table->string('senhaUsuario'); // senha (armazenada como string simples - recomenda-se hash)
            $table->timestamp('dataCadastroUsuario')->useCurrent(); // created_at e updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbUsuario');
    }
};
