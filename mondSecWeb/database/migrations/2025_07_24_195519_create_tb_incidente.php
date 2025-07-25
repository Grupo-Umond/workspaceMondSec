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
        Schema::create('tbIncidente', function (Blueprint $table) {
            $table->bigIncrements('idIncidente');
            $table->integer('quantIncidente');
            $table->string('nivelIncidente');
            $table->date('dataAtualizacao');
            $table->decimal('longitudeIncidente',10,7);
            $table->decimal('latitudeIncidente',10,7);
            $table->unsignedBigInteger('idTipo');

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
        Schema::dropIfExists('tbIncidente');
    }
};
