<?php

namespace App\Http\Controllers;

use App\Http\Controllers\UsuarioController;
use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;




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

}

