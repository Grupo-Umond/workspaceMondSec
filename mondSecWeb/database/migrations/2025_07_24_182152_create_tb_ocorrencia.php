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
            $table->bigIncrements('idOcorrencia');
            $table->string('tituloOcorrencia');
            $table->decimal('latitudeOcorrencia', 10,7);
            $table->decimal('longitudeOcorrencia', 10,7);
            $table->timestamp('dataRegistradaOcorrencia')->useCurrent();
            $table->unsignedBigInteger('idUsuario');
            $table->unsignedBigInteger('idTipo');


            $table->foreign('idUsuario')->references('idUsuario')->on('tbUsuario')->onDelete('cascade');
            $table->foreign('idTipo')->references('idTipo')->on('tbTipoOcorrencia')->onDelete('cascade');
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
