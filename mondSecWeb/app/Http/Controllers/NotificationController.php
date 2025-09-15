<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use App\Models\Usuario;


class NotificationController extends Controller
{
    public function enviarNotificacao(Request $request)
    {
        $token = $request->token;
        $title = $request->title;
        $body = $request->body;

        $response = Http::post('https://exp.host/--/api/v2/push/send', [
            'to' => $token,
            'sound' => 'default',
            'title' => $title,
            'body' => $body,
        ]);

        return response()->json(['status' => 'ok', 'resposta' => $response->json()]);
    }
    

    public function salvarNotificacao(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);
        
        /** @var \App\Models\Usuario */
        $user = Auth::user();
        $user->expoToken = $request->token;
        $user->save();

        return response()->json(['message' => 'Token salvo com sucesso']);
    }
}

