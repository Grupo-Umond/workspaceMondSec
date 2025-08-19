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
        Schema::create('tbRespostaComentario', function (Blueprint $table) {
            $table->id();
            $table->string('mensagem');
            $table->timestamp('data')->useCurrent();
            $table->unsignedBigInteger('idUsuario');
            $table->unsignedBigInteger('idComentario');

            $table->foreign('idUsuario')->references('id')->on('tbUsuario')->onDelete('cascade');
            $table->foreign('idComentario')->references('id')->on('tbComentario')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tbRespostaComentario');
    }
};
