<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WarningMail extends Mailable
{
    use Queueable, SerializesModels;

    public $usuario;
    public $mensagem;

    public function __construct($usuario, $mensagem)
    {
        $this->usuario = $usuario;
        $this->mensagem = $mensagem;
    }

    public function build()
    {
        return $this->subject('Aviso de Exclusão de Conta')
                    ->view('emails.warning');
    }
}
