<?php

namespace App\Http\Controllers;

use App\Http\Controllers\UsuarioController;
use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;



class AuthController extends Controller
{
    
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'senha' => 'required|string',
        ]);

        $user = Usuario::where('emailUsuario', $request->email)->first();

        if (!$user || !Hash::check($request->senha, $user->senhaUsuario)) {
            return response()->json(['message' => 'Credenciais inválidas'], 401);
        }

        $token = $user->createToken('app-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function informationProfile(Request $request)
    {
        return response()->json([
            'usuario' => $request->user()
        ]);
    }
}


