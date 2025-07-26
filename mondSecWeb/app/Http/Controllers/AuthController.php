<?php

namespace App\Http\Controllers;

<<<<<<< HEAD
use App\Http\Controllers\UsuarioController;
use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;


=======
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Usuario;
>>>>>>> c01043568131a18646d5d421cccb15b2bd7d3a14

class AuthController extends Controller
{
    
<<<<<<< HEAD
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
=======
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'senha' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->senha, $user->senha)) {
            return response()->json(['message' => 'Credenciais inválidas'], 401);
        }

        $token = $user->createToken('app-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }
}


>>>>>>> c01043568131a18646d5d421cccb15b2bd7d3a14
