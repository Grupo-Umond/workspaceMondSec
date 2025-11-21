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
            Log::debug('[EmailController@sendCodeEmail] usando login do request: ' . ($email ?? 'NULL'));
        } else {
            $usuario = $request->user();
            Log::debug('[EmailController@sendCodeEmail] request com Authorization, usuario obtido', ['usuario' => $usuario ? $usuario->id ?? $usuario : null]);

            if (!$usuario || empty($usuario->email)) {
                Log::warning('[EmailController@sendCodeEmail] usuário não autenticado ou sem email.');
                return response()->json([
                    'erro' => 'Usuário não autenticado ou e-mail não disponível.'
                ], 401);
            }

            $email = $usuario->email;
        }

        if (empty($email)) {
            Log::warning('[EmailController@sendCodeEmail] email vazio recebido.');

            return response()->json([
                'erro' => 'E-mail não fornecido.'
            ], 400);
        }

        $ultimoEnvio = Cache::get("last_send_{$email}");
        if ($ultimoEnvio && now()->diffInSeconds($ultimoEnvio) < 30) {

            $remaining = 30 - now()->diffInSeconds($ultimoEnvio);
            Log::info('[EmailController@sendCodeEmail] request bloqueado por rate limit', ['email' => $email, 'remaining' => $remaining]);

            return response()->json([
                'erro' => 'Aguarde 30 segundos antes de solicitar outro código.',
                'tempoRestante' => $remaining
            ], 429);
        }

        $codigo = rand(100000, 999999);
        Cache::put("verify_{$email}", (string)$codigo, now()->addMinutes(5));
        Cache::put("last_send_{$email}", now(), now()->addMinutes(5));

        Log::info('[EmailController@sendCodeEmail] codigo gerado e salvo em cache', ['email' => $email, 'codigo' => $codigo]);

        try {
            Mail::to($email)->send(new CodigoEmail($codigo));
            Log::info('[EmailController@sendCodeEmail] mail com codigo enviado', ['email' => $email]);
        } catch (\Exception $e) {
            Log::error('[EmailController@sendCodeEmail] erro ao enviar mail', ['exception' => $e->getMessage()]);

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
            Log::debug('[EmailController@sendCodeSms] token presente, telefone do usuario', ['telefone' => $telefone]);
        } else {
            $telefone = $request->input('telefone');
            Log::debug('[EmailController@sendCodeSms] sem token, telefone do request', ['telefone' => $telefone]);
        }

        if (empty($telefone)) {
            Log::warning('[EmailController@sendCodeSms] telefone não informado.');
            return response()->json(['erro' => 'Telefone não fornecido.'], 400);
        }

        if (strpos($telefone, '+') !== 0) {
            Log::warning('[EmailController@sendCodeSms] telefone sem +, recomendando E.164', ['telefone' => $telefone]);
            return response()->json(['erro' => 'Formato do telefone inválido. Use +<countrycode><number>'], 400);

        }

        $ultimoEnvio = Cache::get("last_send_{$telefone}");
        if ($ultimoEnvio && now()->diffInSeconds($ultimoEnvio) < 30) {
            $remaining = 30 - now()->diffInSeconds($ultimoEnvio);
            Log::info('[EmailController@sendCodeSms] bloqueado por rate limit', ['telefone' => $telefone, 'remaining' => $remaining]);

            return response()->json([
                'erro' => 'Aguarde 30 segundos antes de solicitar outro código.',
                'tempoRestante' => $remaining

            ], 429);
        }

        $code = rand(100000, 999999);
        Cache::put("verify_{$telefone}", (string)$code, now()->addMinutes(5));
        Cache::put("last_send_{$telefone}", now(), now()->addMinutes(5));

        Log::info('[EmailController@sendCodeSms] codigo gerado e salvo em cache', ['telefone' => $telefone, 'codigo' => $code]);

        $sid = env('TWILIO_SID');
        $token = env('TWILIO_AUTH_TOKEN');
        $from = env('TWILIO_FROM');

        if (!$sid || !$token || !$from) {
            Log::error('[EmailController@sendCodeSms] variaveis TWILIO não configuradas', ['TWILIO_SID' => (bool)$sid, 'TWILIO_TOKEN' => (bool)$token, 'TWILIO_FROM' => $from]);
            return response()->json(['erro' => 'Configuração Twilio ausente.'], 500);
        }

        try {
            $twilio = new Client($sid, $token);

            $message = $twilio->messages->create($telefone, [
                'from' => $from,
                'body' => "Seu código de verificação é: {$code}"
            ]);

            Log::info('[EmailController@sendCodeSms] sms enviado', ['sid' => $message->sid ?? null, 'status' => $message->status ?? null]);
        } catch (\Exception $e) {
            Log::error('[EmailController@sendCodeSms] erro ao enviar sms', ['exception' => $e->getMessage()]);
            return response()->json(['erro' => 'Erro ao enviar SMS: ' . $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Código enviado por SMS.']);
    }

    public function verifyCode(Request $request)
    {
        Log::info('[EmailController@verifyCode] entrada', ['body' => $request->all(), 'headers' => $request->headers->all()]);

        $request->validate([
            'code' => 'required|digits:6',
        ]);

        $header = $request->header('Authorization');

        if (!$header) {
            $login = $request->input('login');
            Log::debug('[EmailController@verifyCode] sem Authorization, login do request: ' . ($login ?? 'NULL'));
        } else {
            $usuario = $request->user();
            if (!$usuario) {
                Log::warning('[EmailController@verifyCode] Authorization presente mas usuario null.');
                return response()->json(['erro' => 'Usuário não autenticado.'], 401);
            }

           
            $direcao = $request->input('direcao', true); 
            $login = $direcao ? $usuario->email : $usuario->telefone;
            Log::debug('[EmailController@verifyCode] login obtido via usuario', ['direcao' => $direcao ? 'email' : 'telefone', 'login' => $login]);
        }

        if (empty($login)) {
            Log::warning('[EmailController@verifyCode] login indefinido ao verificar codigo.');
            return response()->json(['message' => 'Login (email/telefone) não fornecido.'], 400);

        }

        $cachedCode = Cache::get("verify_{$login}");

        Log::debug('[EmailController@verifyCode] cachedCode recuperado', ['cached' => $cachedCode, 'provided' => $request->code]);

        if (!$cachedCode || $cachedCode !== $request->code) {
            Log::info('[EmailController@verifyCode] codigo invalido ou expirado', ['login' => $login]);
            return response()->json(['message' => 'Código inválido ou expirado'], 400);
        }

        try {
            $tempToken = bin2hex(random_bytes(16));
            Cache::put("token_{$tempToken}", $login, now()->addMinutes(10));
            Log::info('[EmailController@verifyCode] codigo validado, temp token gerado', ['token' => $tempToken, 'login' => $login]);
        } catch (\Exception $e) {
            Log::error('[EmailController@verifyCode] erro ao gerar token temporario', ['exception' => $e->getMessage()]);
            return response()->json(['erro' => 'Erro interno ao gerar token.'], 500);
        }

        return response()->json(['token' => $tempToken, 'mensagem' => 'Código válido, verificado com sucesso']);
    }

}
