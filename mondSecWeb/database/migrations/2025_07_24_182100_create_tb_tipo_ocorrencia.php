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
        Schema::create('tbTipoOcorrencia', function (Blueprint $table) {
            $table->bigIncrements('idTipo');
            $table->String('nomeTipo');
            $table->String('descricaoTipo');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tbTipoOcorrencia');
    }
};
