<?php

namespace App\Http\Controllers;

use App\Http\Controllers\UsuarioController;
use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;




class AuthController extends Controller
{
        public function store(Request $request)
    {
        $dados = $request->validate([
            'nome'   => 'required|string|max:255',
            'genero' => 'required|string',
            'email'  => 'required|email|unique:tbUsuario,emailUsuario',
            'telefone' => 'required|unique:tbUsuario,telefoneUsuario',
            'senha'  => 'required|string|min:6',
        ]);

        $telefone = preg_replace('/\D/', '', $dados['telefone']);

        if (!str_starts_with($telefone, '55')) {
            $telefone = '55' . $telefone;
        }
        $telefone = '+' . $telefone;

        $usuario = Usuario::create([
            'nomeUsuario' => $dados['nome'],
            'generoUsuario' => $dados['genero'],
            'emailUsuario' => $dados['email'],
            'telefoneUsuario' => $telefone,
            'senhaUsuario' => Hash::make($dados['senha']),
            'dataCadastroUsuario' => now(),
        ]);

        $token = $usuario->createToken('userToken')->accessToken;

        return response()->json([
            'tokenUser' => $token,
            'tokenTipo' => 'Bearer',
            'expiraEm' => 3600,
        ]);
    }

    public function login(Request $request) {
        $request->validate([
            'login' => 'required',
            'senha' => 'required'
        ]);

        if(filter_var($request->login, FILTER_VALIDATE_EMAIL))
            $campo = 'emailUsuario';
        else{
            $campo = 'telefoneUsuario';
        }

        $usuario = Usuario::where($campo, $request->login)->first();

        if (!$usuario || !Hash::check($request->senha, $usuario->senhaUsuario)) {
            return response()->json(['error' => 'Credenciais inválidas'], 401);
        }

        $token = $usuario->createToken('userToken')->accessToken;

        return response()->json([
            'tokenUser' => $token,
            'tokenTipo' => 'Bearer',
            'expiraEm' => 3600,
        ]);
    }

    public function sendCodeEmail(Request $request)
    {
        $usuario = $request->user();
        $email = $usuario->emailUsuario;
        $code = rand(100000, 999999); 
        Cache::put("verify_{$email}", $code, now()->addMinutes(5));

        Mail::raw("Seu código de verificação: {$code}", function($message) use ($email) {
            $message->to($email)
                    ->subject('Código de Verificação');
        });

        return response()->json(['message' => 'Código enviado para seu email.']);
    }
    
    public function sendCodeSms(Request $request)
    {
        $usuario = $request->user();
        $telefone = $usuario->telefoneUsuario;
        $code = rand(100000, 999999); 
        Cache::put("verify_{$telefone}", $code, now()->addMinutes(5));

        $sid    = env('TWILIO_SID');
        $token  = env('TWILIO_TOKEN');
        $twilio = new Client($sid, $token);

        $twilio->messages->create($phone, [
            'from' => env('TWILIO_FROM'),
            'body' => "Seu código de verificação é: {$code}"
    ]);

    return response()->json(['message' => 'Código enviado por SMS.']);
    }


    public function verifyCode(Request $request)
    {
        $request->validate([
            'code'  => 'required|digits:6'
        ]);

        $user = $request->user();
        $email = $user->emailUsuario;

        $cachedCode = Cache::get("verify_{$email}");

        if (!$cachedCode || $cachedCode != $request->code) {
            return response()->json(['message' => 'Código inválido ou expirado'], 400);
        }

        
        $tempToken = bin2hex(random_bytes(16));
        Cache::put("token_{$tempToken}", $email, now()->addMinutes(10));

        return response()->json(['token' => $tempToken]);
    }

}



