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
            $table->increments('idFeedbackPai');
            $table->string('mensagem');
            $table->timestamp('data')->useCurrent();
            $table->unsigedBigInteger('idAdmin');
            $table->unsigedBigInteger('idFeedback');

            $table->foreign('idAdmin')->reference('id')->on('tbAdmin')->onDelete('cascade');
            $table->foreign('idFeedBack')->reference('id')->on('tbFeedback')->onDelete('cascade');
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
