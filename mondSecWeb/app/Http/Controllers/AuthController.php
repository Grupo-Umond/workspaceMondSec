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
        'access_token' => $token,
        'token_type' => 'Bearer',
        'expires_in' => 3600,
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



