<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;

class UsuarioController extends Controller
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

        return response()->json($usuario, 201);
    }

    public function index()
    {
        return response()->json(Usuario::all());
    }

    public function show($id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['mensagem' => 'Usuário não encontrado (idUsuario)'], 404);
        }

        return response()->json($usuario);
    }



    public function updateUsuario(Request $request) {
        $request->validate([
            'nome' => 'required',
            'email' => 'required',
            'genero' => 'required',
            'tokenTemp' => 'required',
        ]);

        $email = Cache::get("token_{$request->tokenTemp}");
        if(!$email) {
            return response()->json(['message' => 'Token inválido ou expirado'], 400);
        }

        $user = Usuario::where('emailUsuario', $email)->firstOrFail();

        if($request->nome) {
            $user->nomeUsuario = $request->nome;
        }
        if($request->email) {
            $user->emailUsuario = $request->email;
        }
        if($request->genero) {
            $user->generoUsuario = $request->genero;
        }

        $user->save();
        Cache::forget("token_{$request->tokenTemp}");

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

    
    public function delete($id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['mensagem' => 'Usuário não encontrado.'], 404);
        }

        $usuario->delete();

        return response()->json(['mensagem' => "Usuário ({$usuario->nomeUsuario}) deletado com sucesso."], 200);
    }


}

    