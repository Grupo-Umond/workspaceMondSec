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
            $table->text('mensagem');
            $table->unsignedBigInteger('idUsuario');
            $table->timestamp('data')->useCurrent();

            $table->foreign('idUsuario')->references('id')->on('tbUsuario')->onDelete('cascade');
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
