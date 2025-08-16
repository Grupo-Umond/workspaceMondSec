<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;

class UsuarioController extends Controller
{
    
    public function informationProfile(Request $request)
    {
        return response()->json([
            'usuario' => $request->user()
        ]);
    }

    public function updateUsuario(Request $request) {
        $request->validate([
            'nome' => 'max:100',
            'email'  => 'email|unique:tbUsuario,emailUsuario',
            'telefone' => 'unique:tbUsuario,telefoneUsuario',
        ]);
        
        $usuario = $request->user();

        if($request->nome) {
            $usuario->nomeUsuario = $request->nome;
        }
        if($request->email) {
            $usuario->emailUsuario = $request->email;
        }
        if($request->telefone) {
            $telefone = preg_replace('/\D/', '', $request->telefone);

            if (!str_starts_with($telefone, '55')) {
                $telefone = '55' . $telefone;
            }

            $telefone = '+' . $telefone;

            $usuario->telefoneUsuario = $telefone;
        }

        if($request->genero) {
            $usuario->generoUsuario = $request->genero;
        }

        $usuario->save();

        return response()->json(['message' => 'Dados atualizados com sucesso']);
    }




    public function updateSenha(Request $request)
    {
        $request->validate([
            'tokenTemp' => 'required',
            'novaSenhaConfirma' => 'nullable|min:6',
        ]);

        $email = Cache::get("token_{$request->tokenTemp}");
        if (!$email) {
            return response()->json(['message' => 'Token inválido ou expirado'], 400);
        }

        $user = Usuario::where('emailUsuario', $email)->firstOrFail();

        if ($request->novaSenhaConfirma) {
            $user->senhaUsuario = bcrypt($request->novaSenhaConfirma);
        }

        $user->save();
        Cache::forget("token_{$request->tokenTemp}");

        return response()->json(['message' => 'Dados atualizados com sucesso']);
    }

    
    public function delete(Request $request)
    {
        $senha = $request->header('senha');
        if(!$senha) {
            return response()->json(['message' => 'Senha não recebida']);
        }

        

        $usuario = $request->user();

        if (!$usuario ) {
            return response()->json(['mensagem' => 'Usuário não encontrado.'], 404);
        }

        if(!Hash::check($senha, $usuario->senhaUsuario)) {
            return response()->json(['mensagem' => 'Senha Incorreta'], 401);
        }

        $usuario->delete();

        return response()->json(['mensagem' => "Usuário ({$usuario->nomeUsuario}) deletado com sucesso."], 200);
    }


}

    