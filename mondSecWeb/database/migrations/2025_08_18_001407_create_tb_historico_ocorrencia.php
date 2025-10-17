<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbHistoricoOcorrencia', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('cep');
            $table->unsignedBigInteger('idTipoOcorrencia');
            $table->unsignedBigInteger('idOcorrencia');
            $table->timestamps();

            $table->foreign('idTipoOcorrencia')->references('id')->on('tbTipoOcorrencia')->onDelete('cascade');
            $table->foreign('idOcorrencia')->references('id')->on('tbOcorrencia')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tbHistoricoOcorrencia');
    }
};
