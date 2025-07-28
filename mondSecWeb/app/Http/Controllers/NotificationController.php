<?php

namespace App\Http\Controllers\NotificationController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;

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
    

    public function salvar(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $user = Auth::user();
        $user->expo_token = $request->token;
        $user->save();

        return response()->json(['message' => 'Token salvo com sucesso']);
    }
}

