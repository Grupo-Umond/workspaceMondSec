<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContatoMail;

class ContatoController extends Controller
{
    public function enviar(Request $request)
    {
        // Validação
        $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|email',
            'assunto' => 'required|string|max:255',
            'mensagem' => 'required|string',
        ]);

        // Enviar e-mail
        Mail::to('contatoumond@gmail.com')->send(new ContatoMail($request->all()));

        return back()->with('success', 'Mensagem enviada com sucesso!');
    }
}
