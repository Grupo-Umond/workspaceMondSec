<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tbTipoOcorrencia', function (Blueprint $table) {
            $table->bigIncrements('idTipo'); // ok, auto-incrementa
            $table->string('nomeTipo');
            $table->string('descricaoTipo')->nullable(); // opcional = evitar erro de insert vazio
            $table->timestamps(); // ✅ importante para compatibilidade com Eloquent
        });
    }

    public function down()
    {
        Schema::dropIfExists('tbTipoOcorrencia');
    }
};
