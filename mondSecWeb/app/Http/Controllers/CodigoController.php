<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use App\Mail\CodigoEmail;
use Twilio\Rest\Client;

class CodigoController extends Controller
{
    public function sendCodeEmail(Request $request)
    {
        $request->validate([
            'login' => 'required|email'
        ]);

        $email = $request->input('login');
        $codigo = rand(100000, 999999);

        Mail::to($email)->send(new CodigoEmail($codigo));

        return response()->json([
            'mensagem' => 'Código enviado com sucesso',
            'codigo' => $codigo
        ]);
    }

    public function sendCodeSms(Request $request)
    {
        $tokenId = $request->bearerToken();
        if ($tokenId) {
            $usuario = $request->user();
            $telefone = $usuario->telefone;
        } else {
            $telefone = $request->telefone;
        }

        $code = rand(100000, 999999);
        Cache::put("verify_{$telefone}", $code, now()->addMinutes(5));

        $sid = env('TWILIO_SID');
        $token = env('TWILIO_TOKEN');
        $twilio = new Client($sid, $token);

        $twilio->messages->create($telefone, [
            'from' => env('TWILIO_FROM'),
            'body' => "Seu código de verificação é: {$code}"
        ]);

        return response()->json(['message' => 'Código enviado por SMS.']);
    }

    public function verifyCode(Request $request)
    {
        $request->validate([
            'code' => 'required|digits:6',
        ]);

        $usuario = $request->user();
        $login = $usuario->email;

        if (!$request->direcao) {
            $login = $usuario->telefone;
        }

        $cachedCode = Cache::get("verify_{$login}");

        if (!$cachedCode || $cachedCode != $request->code) {
            return response()->json(['message' => 'Código inválido ou expirado'], 400);
        }

        $tempToken = bin2hex(random_bytes(16));
        Cache::put("token_{$tempToken}", $login, now()->addMinutes(10));

        return response()->json(['token' => $tempToken]);
    }
}
