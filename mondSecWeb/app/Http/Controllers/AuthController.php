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
            'senha'  => 'required|string|min:6',
        ]);

        $usuario = Usuario::create([
            'nomeUsuario'         => $dados['nome'],
            'generoUsuario'       => $dados['genero'],
            'emailUsuario'        => $dados['email'],
            'senhaUsuario'        => Hash::make($dados['senha']),
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
        'email' => 'required|email',
        'senha' => 'required|string'
    ]);

    $usuario = Usuario::where('emailUsuario', $request->email)->first();

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



    public function informationProfile(Request $request)
    {
        return response()->json([
            'usuario' => $request->user()
        ]);
    }

    public function sendCode(Request $request)
    {
        $user = $request->user();
        $email = $user->emailUsuario;
        $code = rand(100000, 999999); 
        Cache::put("verify_{$email}", $code, now()->addMinutes(5));

        Mail::raw("Seu código de verificação: {$code}", function($message) use ($email) {
            $message->to($email)
                    ->subject('Código de Verificação');
        });

        return response()->json(['message' => 'Código enviado para seu email.']);
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



