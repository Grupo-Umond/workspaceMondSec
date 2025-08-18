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
        Schema::create('tbOcorrencia', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('latitude');
            $table->string('longitude');
            $table->timestamp('data')->useCurrent();
            $table->unsignedBigInteger('idUsuario');
            $table->unsignedBigInteger('idTipoOcorrencia');

            $table->foreign('idUsuario')->references('id')->on('tbUsuario')->onDelete('cascade');
            $table->foreign('idTipoOcorrencia')->references('id')->on('tbTipoOcorrencia')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tbOcorrencia');
    }
};
