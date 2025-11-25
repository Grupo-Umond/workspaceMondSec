<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Twilio\Rest\Client;
use Illuminate\Support\Facades\Cache;
use App\Mail\ContatoMail;
use App\Mail\CodigoEmail;

class EmailController extends Controller
{
    public function enviar(Request $request)
    {
        Log::info('[EmailController@enviar] entrada', ['body' => $request->all()]);

        $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|email',
            'assunto' => 'required|string|max:255',
            'mensagem' => 'required|string',
        ]);

        try {
            $to = env('MAIL_USERNAME');
            if (!$to) {
                Log::warning('[EmailController@enviar] MAIL_USERNAME não configurado.');
                return back()->with('error', 'Configuração de e-mail ausente.');
            }

            Log::info('[EmailController@enviar] enviando mail para ' . $to);
            Mail::to($to)->send(new ContatoMail($request->all()));

            Log::info('[EmailController@enviar] mail enviado com sucesso.');
            return back()->with('success', 'Mensagem enviada com sucesso!');
        } catch (\Exception $e) {
            Log::error('[EmailController@enviar] erro ao enviar mail', ['exception' => $e->getMessage()]);
            return back()->with('error', 'Erro ao enviar mensagem: ' . $e->getMessage());
        }
    }


    public function sendCodeEmail(Request $request)
    {
        Log::info('[EmailController@sendCodeEmail] entrada', ['body' => $request->all(), 'headers' => $request->headers->all()]);

        $request->validate([
            'login' => 'nullable|email'
        ]);

        $header = $request->header('Authorization');

        if (!$header) {
            $email = $request->input('login');
        } else {
            $usuario = $request->user();

            if (!$usuario || empty($usuario->email)) {
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
            $remaining = 30 - now()->diffInSeconds($ultimoEnvio);
            return response()->json([
                'erro' => 'Aguarde 30 segundos antes de solicitar novo código.',
                'tempoRestante' => $remaining
            ], 429);
        }

        $codigo = rand(100000, 999999);

        Cache::put("verify_{$email}", (string)$codigo, now()->addMinutes(5));
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
        Log::info('[EmailController@sendCodeSms] entrada', ['body' => $request->all(), 'headers' => $request->headers->all()]);

        $tokenId = $request->bearerToken();

        if ($tokenId) {
            $usuario = $request->user();
            $telefone = $usuario->telefone ?? null;
        } else {
            $telefone = $request->input('telefone');
        }

        if (empty($telefone)) {
            return response()->json(['erro' => 'Telefone não fornecido.'], 400);
        }

        if (strpos($telefone, '+') !== 0) {
            return response()->json(['erro' => 'Formato inválido. Use +<countrycode><number>'], 400);
        }

        $ultimoEnvio = Cache::get("last_send_{$telefone}");

        if ($ultimoEnvio && now()->diffInSeconds($ultimoEnvio) < 30) {
            $remaining = 30 - now()->diffInSeconds($ultimoEnvio);
            return response()->json([
                'erro' => 'Aguarde 30 segundos antes de solicitar novo SMS.',
                'tempoRestante' => $remaining
            ], 429);
        }

        $code = rand(100000, 999999);

        Cache::put("verify_{$telefone}", (string)$code, now()->addMinutes(5));
        Cache::put("last_send_{$telefone}", now(), now()->addMinutes(5));

        $sid = env('TWILIO_SID');
        $token = env('TWILIO_AUTH_TOKEN');
        $from = env('TWILIO_FROM');

        if (!$sid || !$token || !$from) {
            return response()->json(['erro' => 'Twilio não configurado.'], 500);
        }

        try {
            $twilio = new Client($sid, $token);

            $twilio->messages->create($telefone, [
                'from' => $from,
                'body' => "Seu código de verificação é: {$code}"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'erro' => 'Erro ao enviar SMS: ' . $e->getMessage()
            ], 500);
        }

        return response()->json(['message' => 'Código enviado por SMS.']);
    }
}
