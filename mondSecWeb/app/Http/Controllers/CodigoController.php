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
            'login' => 'nullable|email'
        ]);

        $header = $request->header('Authorization');

        if (!$header) {
            $email = $request->login;
        } else {
            $usuario = $request->user();

            if (!$usuario || !$usuario->email) {
                return response()->json([
                    'erro' => 'Usuário não autenticado ou e-mail não disponível.'
                ], 401);
            }

            $email = $usuario->email;
        }

        if (empty($email)) {
            return response()->json([
                'erro' => 'E-mail não fornecido.'
            ], 400);
        }

        // 🔒 Limite de 30 segundos entre envios
        $ultimoEnvio = Cache::get("last_send_{$email}");
        if ($ultimoEnvio && now()->diffInSeconds($ultimoEnvio) < 30) {
            return response()->json([
                'erro' => 'Aguarde 30 segundos antes de solicitar outro código.',
                'tempoRestante' => 30 - now()->diffInSeconds($ultimoEnvio)
            ], 429);
        }

        $codigo = rand(100000, 999999);
        Cache::put("verify_{$email}", $codigo, now()->addMinutes(5));
        Cache::put("last_send_{$email}", now(), now()->addMinutes(5));

        try {
            Mail::to($email)->send(new CodigoEmail($codigo));
        } catch (\Exception $e) {
            return response()->json([
                'erro' => 'Erro ao enviar e-mail: ' . $e->getMessage()
            ], 500);
        }

        return response()->json([
            'mensagem' => 'Código enviado com sucesso por email',
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

        // 🔒 Limite de 30 segundos entre envios
        $ultimoEnvio = Cache::get("last_send_{$telefone}");
        if ($ultimoEnvio && now()->diffInSeconds($ultimoEnvio) < 30) {
            return response()->json([
                'erro' => 'Aguarde 30 segundos antes de solicitar outro código.',
                'tempoRestante' => 30 - now()->diffInSeconds($ultimoEnvio)
            ], 429);
        }

        $code = rand(100000, 999999);
        Cache::put("verify_{$telefone}", $code, now()->addMinutes(5));
        Cache::put("last_send_{$telefone}", now(), now()->addMinutes(5));

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
        $header = $request->header('Authorization');
        if(!$header){
            $login = $request->login;
        }
        else if($header){
            $usuario = $request->user();
            $login = $usuario->email;
            if (!$request->direcao) {
                $login = $usuario->telefone;
            }
        }

        $cachedCode = Cache::get("verify_{$login}");

        if (!$cachedCode || $cachedCode != $request->code) {
            return response()->json(['message' => 'Código inválido ou expirado'], 400);
        }

        $tempToken = bin2hex(random_bytes(16));
        Cache::put("token_{$tempToken}", $login, now()->addMinutes(10));

        return response()->json(['token' => $tempToken, 'mensagem' => 'Codigo valido, verificado com sucesso']);
    }
}
