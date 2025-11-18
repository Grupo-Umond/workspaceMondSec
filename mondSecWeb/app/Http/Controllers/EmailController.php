<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Twilio\Rest\Client;
use Illuminate\Support\Facades\Cache;
use App\Mail\ContatoMail;
use App\Mail\CodigoMail;

class EmailController extends Controller
{
    public function enviar(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|email',
            'assunto' => 'required|string|max:255',
            'mensagem' => 'required|string',
        ]);

        Mail::to(env('MAIL_USERNAME'))->send(new ContatoMail($request->all()));

        return back()->with('success', 'Mensagem enviada com sucesso!');
    }

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
            Mail::to($email)->send(new CodigoMail($codigo));
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

        if (empty($telefone)) {
            return response()->json(['erro' => 'Telefone não informado.'], 400);
        }

        $telefone = preg_replace('/\D/', '', $telefone); 

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

        try {
            $sid = env('TWILIO_SID');
            $token = env('TWILIO_TOKEN');
            $twilio = new Client($sid, $token);

            $twilio->messages->create($telefone, [
                'from' => env('TWILIO_FROM'),
                'body' => "Seu código de verificação é: {$code}"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'erro' => 'Falha ao enviar SMS: ' . $e->getMessage()
            ], 500);
        }

        return response()->json(['message' => 'Código enviado por SMS.']);
    }

    public function verifyCode(Request $request)
    {
        $request->validate([
            'code' => 'required|digits:6',
        ]);

        $header = $request->header('Authorization');

        if (!$header) {
            $login = $request->login;
        } else {
            $usuario = $request->user();
            $login = $request->direcao ? $usuario->email : $usuario->telefone;
        }

        $cachedCode = Cache::get("verify_{$login}");

        if (!$cachedCode || $cachedCode != $request->code) {
            return response()->json(['message' => 'Código inválido ou expirado'], 400);
        }

        $tempToken = bin2hex(random_bytes(16));
        Cache::put("token_{$tempToken}", $login, now()->addMinutes(10));

        return response()->json([
            'token' => $tempToken,
            'mensagem' => 'Codigo valido, verificado com sucesso'
        ]);
    }
}
