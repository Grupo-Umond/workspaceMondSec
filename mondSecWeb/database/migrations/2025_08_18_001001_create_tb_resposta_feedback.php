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
            $table->text('mensagem');
            $table->unsignedBigInteger('idFeedback');
            $table->unsignedBigInteger('idAdmin');
            $table->timestamp('data')->useCurrent();

            $table->foreign('idFeedback')->references('id')->on('tbFeedback')->onDelete('cascade');
            $table->foreign('idAdmin')->references('id')->on('tbAdmin')->onDelete('cascade');
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
