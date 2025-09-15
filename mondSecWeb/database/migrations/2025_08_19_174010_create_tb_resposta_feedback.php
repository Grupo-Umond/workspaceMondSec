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
        Schema::create('tbRespostaFeedback', function (Blueprint $table) {
            $table->id();
            $table->string('mensagem');
            $table->timestamp('data')->useCurrent();
            $table->unsignedBigInteger('idAdmin');
            $table->unsignedBigInteger('idFeedback');

            $table->foreign('idAdmin')->references('id')->on('tbAdmin')->onDelete('cascade');
            $table->foreign('idFeedBack')->references('id')->on('tbFeedback')->onDelete('cascade');
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tbRespostaFeedback');
    }
};
