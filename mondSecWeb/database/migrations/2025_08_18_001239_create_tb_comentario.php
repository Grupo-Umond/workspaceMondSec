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
        Schema::create('tbComentario', function (Blueprint $table) {
            $table->id();
            $table->text('mensagem');
            $table->timestamp('data')->useCurrent();
            $table->unsignedBigInteger('idUsuario');
            $table->unsignedBigInteger('idOcorrencia');

            $table->foreign('idUsuario')->references('id')->on('tbUsuario')->onDelete('cascade');
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
        Schema::dropIfExists('tbComentario');
    }
};
