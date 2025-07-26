<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tbTipoOcorrencia', function (Blueprint $table) {
            $table->bigIncrements('idTipo'); 
            $table->string('nomeTipo');
            $table->string('descricaoTipo')->nullable(); 
            $table->timestamps(); 
        });
    }

    public function down()
    {
        Schema::dropIfExists('tbTipoOcorrencia');
    }
};
