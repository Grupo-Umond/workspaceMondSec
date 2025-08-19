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
            $table->increments('idComentarioPai');
            $table->string('mensagem');
            $table->timestamp('data')->useCurrent();
            $table->unsigedBigInteger('idUsuario');
            $table->unsigedBigInteger('idComentario');

            $table->foreign('idUsuario')->reference('id')->on('tbUsuario')->onDelete('cascade');
            $table->foreign('idComentario')->reference('id')->on('tbComentario')->onDelete('cascade');

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
